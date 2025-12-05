import BaseError from './base_error.js';

enum InvalidStateErrorCodes {
  INVALID_STATE_ERROR = 'INVALID_STATE_ERROR',
}

export default class InvalidStateError extends BaseError<InvalidStateErrorCodes> {
  constructor(message: string, originalError?: Error | unknown) {
    super(InvalidStateErrorCodes.INVALID_STATE_ERROR, message, originalError, 409);
  }
}
