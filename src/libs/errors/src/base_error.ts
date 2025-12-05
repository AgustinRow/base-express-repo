/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { isString } from 'lodash-es';

enum GenericReason {
  UNKNOWN = 'UNKNOWN',
}

export default class BaseError<Reason = GenericReason> extends Error {
  public get httpStatusCode(): number | undefined {
    return this._httpStatusCode;
  }

  constructor(
    public readonly reason: Reason,
    messageOrOriginalError?: string | any,
    public readonly originalError?: any,
    private readonly _httpStatusCode?: number
  ) {
    super(isString(messageOrOriginalError) ? messageOrOriginalError : undefined);

    if (!isString(messageOrOriginalError)) {
      this.originalError = {
        ...messageOrOriginalError,
        message: messageOrOriginalError.message,
        stack: messageOrOriginalError.stack,
        stacktrace: messageOrOriginalError.stacktrace,
        httpStatusCode: 500,
      };
    }
  }
}
