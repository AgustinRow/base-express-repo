import winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const colors = {
  error: 'bold red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(
    ({ timestamp, level, stack, message, meta, label }) =>
      `${String(timestamp)}  ${String(label ?? '')} ${level}: ${String(message)} : ${String(stack ?? '')} ${String(meta ?? '')}`
  ),
  winston.format.colorize({ all: true })
);

const transports = [
  new winston.transports.Console(),
  // new winston.transports.File({
  //   filename: 'logs/error.log',
  //   level: 'error'
  // }) // <-- uncomment this line to write log only errors
  // new winston.transports.File({ filename: 'logs/all.log' }) // <-- uncomment this line to log write all the messages
];

const logger = winston.createLogger({
  level: process.env.ENVIRONMENT !== 'production' ? 'debug' : 'info',
  levels,
  format,
  transports,
});

export default logger;
