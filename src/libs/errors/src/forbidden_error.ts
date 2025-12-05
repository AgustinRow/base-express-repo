import BaseError from './base_error.js';

export enum ForbiddenErrorCodes {
  FORBIDDEN = 'FORBIDDEN',
  ACCESS_DENIED = 'ACCESS_DENIED',
}

export default class ForbiddenError extends BaseError<ForbiddenErrorCodes> {
  constructor(errorCode: ForbiddenErrorCodes, message: string, originalError?: Error | unknown) {
    super(errorCode, message, originalError, 403);
  }
}
