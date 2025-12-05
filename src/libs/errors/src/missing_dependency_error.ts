import BaseError from './base_error.js';

enum MissingDependencyErrorCodes {
  MISSING = 'MISSING_DEPENDENCY_ERROR',
}

export default class MissingDependencyError extends BaseError<MissingDependencyErrorCodes> {
  constructor(message: string, originalError?: Error) {
    super(MissingDependencyErrorCodes.MISSING, message, originalError, 424);
  }
}
