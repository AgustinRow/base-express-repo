import path from 'path';
import globby from 'globby';
import { ContainerModule } from 'inversify';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

const dependenciesPaths = globby.sync([path.join(dirname, '..', '**', 'dependencies.(t|j)s')]);
const dependencies: ContainerModule[] = [];

logger.info('Dependencies');

await Promise.all(
  dependenciesPaths.map(async file => {
    logger.info(`  Loading ${file}`);
    const start = Date.now();
    const { default: defaultExport } = await import(path.resolve(process.cwd(), file));
    dependencies.push(defaultExport);
    logger.info(`  (${((Date.now() - start) / 1000).toFixed(3)}s) Finished loading ${file}`);
  })
);

export default dependencies;
