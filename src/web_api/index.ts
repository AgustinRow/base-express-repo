import 'reflect-metadata';

// import cors from 'cors'; Maybe needed
import express, { json, text } from 'express';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

import logger from '../utils/logger.js';
import morganMiddleware from '../utils/morgan.js';
import applyRequestNamespace from './3rd_party/cls_namespaces/express_middleware.js';
import { IDBBuilder } from './3rd_party/db_provider/knex.js';
import './validate_constants.js';
import { PORT } from './constant_api.js';
import './setup_express_routes.js';
import dependencies from './setup_module_dependencies.js';

(async () => {
  //const corsOriginsRegex = new RegExp(ALLOWED_CORS_ORIGINS_REGEX);
  const port = PORT;
  const app = express();

  app.set('trust proxy', 1);
  app.use(json({ limit: '5mb' }));
  app.use(text({ limit: '5mb', type: 'text/plain' }));

  app.use(applyRequestNamespace);
  app.use(morganMiddleware);

  const dependencyContainer = new Container({
    skipBaseClassChecks: true,
  });

  dependencyContainer.load(...dependencies);
  const dbBuilderResult = await dependencyContainer.get<IDBBuilder>('IDBBuilder').build();

  if (dbBuilderResult.isErr()) throw new Error(dbBuilderResult.error.originalError);

  const server = new InversifyExpressServer(dependencyContainer, null, null, app);
  server.build().listen(port, () => {
    logger.info(`Server ready at http://localhost:${port}`);
    //logger.info(`Accepting requests whose origin matches: ${corsOriginsRegex.toString()}`);
  });
})().catch(logger.error);
