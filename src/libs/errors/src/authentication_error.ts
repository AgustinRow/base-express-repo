import BaseError from './base_error.js';

export enum AuthenticationErrorCodes {
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_TOKEN = 'INVALID_TOKEN',
  INVALID_EMAIL = 'INVALID_EMAIL',
  TENANT_NOT_FOUND = 'TENANT_NOT_FOUND',
  INVALID_CODE = 'INVALID_CODE',
  INVALID_SINGLE_USE_CODE = 'INVALID_SINGLE_USE_CODE',
}

export default class AuthenticationError extends BaseError<AuthenticationErrorCodes> {
  constructor(errorCode: AuthenticationErrorCodes, message: string, originalError?: Error | unknown) {
    super(errorCode, message, originalError, 401);
  }
}

export class AuthenticationInvalidAccessTokenError extends BaseError<AuthenticationErrorCodes> {
  constructor(message: string, originalError?: Error | unknown) {
    super(AuthenticationErrorCodes.INVALID_TOKEN, message, originalError, 401);
  }
}

export class AuthenticationUserNotFoundError extends BaseError<AuthenticationErrorCodes> {
  constructor(message: string, originalError?: Error | unknown) {
    super(AuthenticationErrorCodes.USER_NOT_FOUND, message, originalError, 401);
  }
}
