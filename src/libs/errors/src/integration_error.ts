import BaseError from './base_error.js';

export enum IntegrationErrorCodes {
  INTEGRATION_EVENT_MEDIATOR_NOT_FOUND = 'INTEGRATION_EVENT_MEDIATOR_NOT_FOUND',
}

export default class IntegrationError extends BaseError<IntegrationErrorCodes> {
  constructor(message: string, originalError?: Error | unknown) {
    super(IntegrationErrorCodes.INTEGRATION_EVENT_MEDIATOR_NOT_FOUND, message, originalError, 404);
  }
}
