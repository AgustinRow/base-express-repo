/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Umzug, SequelizeStorage } from 'umzug';
import globby from 'globby';
import { Sequelize } from 'sequelize';
import * as path from 'path';
import { IS_LOCAL } from '../web_api/constants_common.js';
import {
  RELATIONAL_DB_NAME,
  RELATIONAL_DB_PASSWORD,
  RELATIONAL_DB_HOST,
  RELATIONAL_DB_USERNAME,
  RELATIONAL_DB_PORT,
} from '../web_api/constants_db.js';
const dirname = path.resolve(__dirname);

const sequelize = new Sequelize(RELATIONAL_DB_NAME, RELATIONAL_DB_USERNAME, RELATIONAL_DB_PASSWORD, {
  host: RELATIONAL_DB_HOST,
  dialect: 'postgres',
  port: parseInt(RELATIONAL_DB_PORT),
  logging: console.log,
  define: {
    freezeTableName: true,
  },
  pool: {
    max: 2,
    min: 1,
    idle: 0,
    acquire: 3000,
    evict: 500000,
  },
  ...(!IS_LOCAL && {
    dialectOptions: {
      ssl: {
        require: true, // This will help you connect to the cloud database securely
        rejectUnauthorized: false, // You may need this option depending on your cloud provider
      },
    },
  }),
});
sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Migrations
const migrationFiles = globby.sync([path.join(dirname, '..', '**', '_migrations', '*.ts')]);

const extractDateFromFilename = (file: any) => {
  const fileName = path.basename(file);
  const datePart = fileName.split('-')[0];
  return datePart!;
};

// Ordenar los archivos por la fecha
const sortedMigrationFiles = migrationFiles.sort((a, b) => {
  const dateA = extractDateFromFilename(a);
  const dateB = extractDateFromFilename(b);
  return dateA.localeCompare(dateB); // Ordena como strings
});

const migrations = sortedMigrationFiles.map(file =>
  import(file).then(({ default: migration }) => ({
    ...migration,
    name: path.basename(file),
  }))
);
export const migrator = new Umzug({
  migrations: context =>
    Promise.all(migrations).then(migrationList =>
      migrationList.map(migration => ({
        name: migration.name,
        up: () => migration.up(context, Sequelize),
        down: () => migration.down(context, Sequelize),
      }))
    ),
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize,
    modelName: '_migrationsMeta',
  }),
  logger: console,
});
export type Migration = typeof migrator._types.migration;

// Seeders

const seederFiles = globby.sync([path.join(dirname, '..', '**', '_seeders', '*.ts')]);
const seeders = seederFiles.map(file =>
  import(file).then(({ default: migration }) => ({
    ...migration,
    name: path.basename(file),
  }))
);
export const seeder = new Umzug({
  migrations: context =>
    Promise.all(seeders).then(seederList =>
      seederList.map(seeder => ({
        name: seeder.name,
        up: () => seeder.up(context, Sequelize),
        down: () => seeder.down(context, Sequelize),
      }))
    ),
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize,
    modelName: '_migrationsMeta',
  }),
  logger: console,
});
export type Seeder = typeof seeder._types.migration;
