import BaseError from './base_error.js';

enum SecretErrorCodes {
  SECRET_NOT_FOUND = 'SECRET_NOT_FOUND',
}

export default class SecretNotFoundError extends BaseError<SecretErrorCodes> {
  constructor(message: string, originalError?: Error | unknown) {
    super(SecretErrorCodes.SECRET_NOT_FOUND, message, originalError, 401);
  }
}
