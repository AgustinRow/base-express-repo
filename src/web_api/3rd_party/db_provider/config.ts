import { AsyncResult, ok } from '../../../libs/result/index.js';
import { UnknownError, SecretNotFoundError } from '../../../libs/errors/index.js';
import {
  RELATIONAL_DB_NAME,
  RELATIONAL_DB_USERNAME,
  RELATIONAL_DB_HOST,
  RELATIONAL_DB_PORT,
  RELATIONAL_DB_DIALECT,
  RELATIONAL_DB_PASSWORD,
} from '../../constants_db.js';
import { IS_LOCAL } from '../../constants_common.js';
import logger from '../../../utils/logger.js';
import { Knex } from 'knex';

export interface DbConfig {
  database: string | undefined;
  username: string | undefined;
  password: string | undefined;
  host: string | undefined;
  port: number;
  logging?: boolean;
  dialect: string;
  define?: {
    freezeTableName: boolean;
  };
}

export interface IDBConfigProvider {
  getSequelizeConfig: () => AsyncResult<DbConfig, UnknownError | SecretNotFoundError>;
  getKnexConfig: () => AsyncResult<Knex.Config, UnknownError | SecretNotFoundError>;
}

export default class DBConfigProvider implements DBConfigProvider {
  async getSequelizeConfig(): AsyncResult<DbConfig, UnknownError | SecretNotFoundError> {
    logger.info('  calling secrets provider');
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions

    return ok({
      database: RELATIONAL_DB_NAME,
      username: RELATIONAL_DB_USERNAME,
      password: RELATIONAL_DB_PASSWORD,
      host: RELATIONAL_DB_HOST,
      port: Number(RELATIONAL_DB_PORT) || 5432,
      dialect: RELATIONAL_DB_DIALECT ?? 'postgres',
      logging: IS_LOCAL,
      define: {
        freezeTableName: true,
      },
    });
  }
  async getKnexConfig(): AsyncResult<Knex.Config, UnknownError | SecretNotFoundError> {
    const config: Knex.Config = {
      client: 'pg',
      connection: {
        host: RELATIONAL_DB_HOST,
        port: Number(RELATIONAL_DB_PORT) || 5432,
        user: RELATIONAL_DB_USERNAME,
        password: RELATIONAL_DB_PASSWORD,
        database: RELATIONAL_DB_NAME,
      },
      pool: {
        min: 2,
        max: 10,
      },
      migrations: {
        directory: './migrations',
        tableName: 'knex_migrations',
      },
    };

    return ok(config);
  }
}
