import BaseError from './base_error.js';

export enum UnexpectedErrorCodes {
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
}

export default class UnexpectedError extends BaseError<UnexpectedErrorCodes> {
  constructor(message: string, originalError?: Error | unknown) {
    super(UnexpectedErrorCodes.UNEXPECTED_ERROR, message, originalError, 500);
  }
}
