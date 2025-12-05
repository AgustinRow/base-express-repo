import BaseError from './base_error.js';

export enum UnprocessableEntityErrorCodes {
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
}

export default class UnprocessableEntityError extends BaseError<UnprocessableEntityErrorCodes> {
  constructor(message: string, originalError?: Error | unknown) {
    super(UnprocessableEntityErrorCodes.UNPROCESSABLE_ENTITY, message, originalError, 422);
  }
}
