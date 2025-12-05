import BaseError from './base_error.js';

enum InvalidObjectSchemaErrorCodes {
  INVALID_OBJECT_SCHEMA_ERROR = 'INVALID_OBJECT_SCHEMA_ERROR',
}

export default class InvalidObjectSchemaError extends BaseError<InvalidObjectSchemaErrorCodes> {
  protected field?: string;

  constructor(message: string, originalError?: Error | unknown, field?: string) {
    super(InvalidObjectSchemaErrorCodes.INVALID_OBJECT_SCHEMA_ERROR, message, originalError, 400);
    this.field = field;
  }
}
