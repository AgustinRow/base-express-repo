import BaseError from './base_error.js';

export enum AuthorizationErrorCodes {
  UNAUTHORIZED_ERROR = 'UNAUTHORIZED_ERROR',
  BUILD_AUTHORIZATION_ENTITY_ERROR = 'BUILD_AUTHORIZATION_ENTITY_ERROR',
  ACCESS_DENIED = 'ACCESS_DENIED',
}

export default class AuthorizationError extends BaseError<AuthorizationErrorCodes> {
  constructor(message: string, originalError?: Error | unknown, errorCode?: AuthorizationErrorCodes) {
    super(errorCode ?? AuthorizationErrorCodes.UNAUTHORIZED_ERROR, message, originalError, 401);
  }

  override get httpStatusCode(): number | undefined {
    if (this.reason === AuthorizationErrorCodes.ACCESS_DENIED) {
      return 403;
    }
    return super.httpStatusCode;
  }
}
