import path from 'path';
import { Knex } from 'knex';
import knex from 'knex';
import { Model } from 'objection';
import globby from 'globby';
import { isFunction } from 'lodash-es';
import { AsyncResult, err, ok } from '../../../libs/result/index.js';
import { UnknownError, SecretNotFoundError } from '../../../libs/errors/index.js';
import { fileURLToPath } from 'url';
import logger from '../../../utils/logger.js';
import * as configJs from '../db_provider/config.js';
import { inject } from 'inversify';

const dirname = fileURLToPath(new URL('.', import.meta.url));
const modelPaths = globby.sync([path.join(dirname, '..', '..', '..', '**', '*.model.(t|j)s')]);

const modelClasses: (typeof Model)[] = [];

logger.info('Loading models');
await Promise.all(
  modelPaths.map(async file => {
    logger.info(`  Loading ${file}`);
    const start = Date.now();
    const { default: defaultExport } = await import(path.resolve(process.cwd(), file));

    // Objection models are classes
    if (!defaultExport || !defaultExport.prototype || !(defaultExport.prototype instanceof Model)) {
      throw new Error(`Model file ${file} does not export an Objection Model class: ${String(defaultExport)}`);
    }

    modelClasses.push(defaultExport);
    logger.info(`  (${((Date.now() - start) / 1000).toFixed(3)}s) Finished loading ${file}`);
  })
);

export interface IDBBuilder {
  build: () => AsyncResult<Knex, UnknownError | SecretNotFoundError>;
}

export class KnexBuilder implements IDBBuilder {
  constructor(@inject('IDBConfigProvider') private readonly dbConfigProvider: configJs.IDBConfigProvider) {}

  async build(): AsyncResult<Knex, UnknownError | SecretNotFoundError> {
    logger.info('Knex builder: calling dbConfig provider');
    const config = await this.dbConfigProvider.getKnexConfig();

    if (config.isErr()) return err(config.error);

    // Create Knex instance
    const knexInstance = knex(config.value as Knex.Config);

    // Test connection
    try {
      await knexInstance.raw('SELECT 1');
      logger.info('Database Connected');
    } catch (error) {
      logger.error('Database connection failed:', error);
      return err(new UnknownError('Database connection failed', error));
    }

    // Bind Knex instance to Objection Model globally
    Model.knex(knexInstance);

    // Setup model relationships
    for (const ModelClass of modelClasses) {
      // Call static relationMappings if it's a function
      if (isFunction(ModelClass.relationMappings)) {
        (ModelClass as any).relationMappings = (ModelClass.relationMappings as any)();
      }

      logger.info(`  model [${ModelClass.tableName}] done`);
    }

    return ok(knexInstance);
  }
}
