import path from 'path';
import { Options, Sequelize } from 'sequelize';
import { sequelizeNamespace } from '../cls_namespaces/index.js';
import * as configJs from './config.js';
import globby from 'globby';
import { isFunction } from 'lodash-es';
import { inject } from 'inversify';
import { AsyncResult, err, ok } from '../../../libs/result/index.js';
import { UnknownError, SecretNotFoundError } from '../../../libs/errors/index.js';
import { fileURLToPath } from 'url';
import logger from '../../../utils/logger.js';

Sequelize.useCLS(sequelizeNamespace);

const dirname = fileURLToPath(new URL('.', import.meta.url));

const modelPaths = globby.sync([path.join(dirname, '..', '..', '..', '**', '*.model.(t|j)s')]);

const initFunctions: any[] = [];
logger.info('Loading models');
await Promise.all(
  modelPaths.map(async file => {
    logger.info(`  Loading ${file}`);
    const start = Date.now();
    const { default: defaultExport } = await import(path.resolve(process.cwd(), file));

    if (!isFunction(defaultExport)) {
      throw new Error(`Model file ${file} does not export a function: ${String(defaultExport)}`);
    }

    initFunctions.push(defaultExport);

    logger.info(`  (${((Date.now() - start) / 1000).toFixed(3)}s) Finished loading ${file}`);
  })
);
export interface IDBBuilder {
  build: () => AsyncResult<Sequelize, UnknownError | SecretNotFoundError>;
}

export class SequelizeBuilder implements IDBBuilder {
  constructor(@inject('IDBConfigProvider') private readonly dbConfigProvider: configJs.IDBConfigProvider) {}

  async build(): AsyncResult<Sequelize, UnknownError | SecretNotFoundError> {
    logger.info('Sequelize builder: calling dbConfig provider');

    const config = await this.dbConfigProvider.getKnexConfig();

    if (config.isErr()) return err(config.error);

    const sequelize = new Sequelize(config.value as unknown as Options);
    sequelize
      .authenticate()
      .then(() => logger.info('Database Connected'))
      .catch(error => logger.error(error));

    const models = initFunctions.map(init => init(sequelize));

    for (const model of models) {
      if ('associate' in model) {
        model.associate(sequelize.models);
      }
      logger.info(`  model [${model.getTableName() as string}] done`);
    }
    return ok(sequelize);
  }
}
