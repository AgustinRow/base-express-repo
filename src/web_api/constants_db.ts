import * as dotenv from 'dotenv';
dotenv.config();

export const RELATIONAL_DB_NAME = process.env.RELATIONAL_DB_NAME ?? '';
export const RELATIONAL_DB_USERNAME = process.env.RELATIONAL_DB_USERNAME ?? '';
export const RELATIONAL_DB_PASSWORD = process.env.RELATIONAL_DB_PASSWORD;
export const RELATIONAL_DB_HOST = process.env.RELATIONAL_DB_HOST;
export const RELATIONAL_DB_PORT = process.env.RELATIONAL_DB_PORT ?? '5432';
export const RELATIONAL_DB_DIALECT = process.env.RELATIONAL_DB_DIALECT ?? 'postgres';
