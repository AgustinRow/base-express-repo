import BaseError from './base_error.js';

export enum ParserErrorCodes {
  INVALID_FILTER_SPEC = 'INVALID_FILTER_SPEC',
}

export default class ParseFilterError extends BaseError<ParserErrorCodes> {
  constructor(message: string, originalError?: Error | unknown) {
    super(ParserErrorCodes.INVALID_FILTER_SPEC, message, originalError, 500);
  }
}
