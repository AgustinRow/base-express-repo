import BaseError from './base_error.js';

export enum NotFoundErrorCodes {
  NOT_FOUND = 'NOT_FOUND',
}

export default class NotFoundError extends BaseError<NotFoundErrorCodes> {
  constructor(message: string, originalError?: Error | unknown) {
    super(NotFoundErrorCodes.NOT_FOUND, message, originalError, 404);
  }
}
