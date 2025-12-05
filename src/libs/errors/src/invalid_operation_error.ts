import BaseError from './base_error.js';

enum InvalidOperationErrorCodes {
  INVALID_OPERATION_ERROR = 'INVALID_OPERATION_ERROR',
}

export default class InvalidOperationError extends BaseError<InvalidOperationErrorCodes> {
  constructor(message: string, originalError?: Error | unknown) {
    super(InvalidOperationErrorCodes.INVALID_OPERATION_ERROR, message, originalError, 403);
  }
}
