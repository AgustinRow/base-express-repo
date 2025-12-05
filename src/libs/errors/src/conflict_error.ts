import BaseError from './base_error.js';

export enum ConflictErrorCodes {
  CONFLICT = 'CONFLICT',
}

export default class ConflictError extends BaseError<ConflictErrorCodes> {
  constructor(message: string, originalError?: Error | unknown) {
    super(ConflictErrorCodes.CONFLICT, message, originalError, 409);
  }
}
