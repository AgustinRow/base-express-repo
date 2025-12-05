import path from 'path';
import globby from 'globby';

import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

const resolversPaths = globby.sync([path.join(dirname, '..', '**', '*.express.(t|j)s')]);

logger.info('Express routes');

await Promise.all(
  resolversPaths.map(async file => {
    logger.info(`  Loading ${file}`);
    const start = Date.now();
    await import(path.resolve(process.cwd(), file));
    logger.info(`  (${((Date.now() - start) / 1000).toFixed(3)}s) Finished loading ${file}`);
  })
);
