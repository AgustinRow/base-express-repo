import * as dotenv from 'dotenv';
dotenv.config();

export const IS_LOCAL = process.env.ENVIRONMENT === 'local';
