import BaseError from './base_error.js';

enum UnknownErrorCodes {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export default class UnknownError extends BaseError<UnknownErrorCodes> {
  constructor(message: string, originalError?: Error | unknown) {
    super(UnknownErrorCodes.UNKNOWN_ERROR, message, originalError, 500);
  }
}
