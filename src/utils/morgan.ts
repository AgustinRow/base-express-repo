import morgan from 'morgan';
import logger from './logger.js';

const stream = {
  // Use the http severity
  write: (message: any) => logger.http(message),
};

const morganMiddleware = morgan(
  ':remote-addr :method :url :status :res[content-length] - :response-time ms',

  { stream }
);

export default morganMiddleware;
