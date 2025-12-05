import { BaseError } from '../../libs/errors/index.js';
import { AsyncResult, Result } from '../../libs/result/index.js';
import { Request, Response } from 'express';
import { isFunction, isNil } from 'lodash-es';
import logger from '../logger.js';
import { isReadable } from 'isstream';

function isMutation(req: Request): boolean {
  return req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE';
}

export interface CookieAttributes {
  expires?: Date;
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
}
export interface ComplexCookie<TValue = string> {
  value: TValue;
  options?: CookieAttributes;
}

export async function handleRequestErrors<R, E extends BaseError<any>, PE extends BaseError<any>>(
  req: Request,
  res: Response,
  onSuccess: <R extends { data: any }>(response: R, res: Response) => Promise<void>,
  controller: (args: any) => AsyncResult<R, E>,
  presenter?: (args: R) => AsyncResult<any, PE>,
  headers?: { [name: string]: string } | ((args: R) => { [name: string]: string })
): Promise<void> {
  try {
    const payload = req.validatedPayload;

    const controllerResult = await controller({ ...payload });
    let requestResult: Result<R, E> | Result<any, PE> = controllerResult;

    if (isFunction(presenter) && controllerResult.isOk()) {
      requestResult = await presenter(controllerResult.value);
    }

    if (requestResult.isErr()) {
      logger.error(requestResult.error);
      let response;
      if (isMutation(req)) {
        response = {
          error: requestResult.error,
          message: requestResult.error.message ?? 'An error ocurred while executing the request',
          success: false,
          code: requestResult.error.reason.toString(),
        };
      } else {
        response = {
          error: requestResult.error,
        };
      }

      const statusCode = requestResult.error?.httpStatusCode ?? requestResult.error?.originalError?.httpStatusCode;
      res.status(statusCode ?? 500).send(response);
    } else {
      let response;
      if (isMutation(req)) {
        response = {
          data: requestResult.value,
          message: 'Operation executed successfully',
          success: true,
          code: 'SUCCESS',
        };
      } else {
        response = {
          data: requestResult.value,
        };
      }
      let finalHeaders = !isNil(headers) && !isFunction(headers) ? headers : undefined;
      if (!isNil(headers) && isFunction(headers) && controllerResult.isOk()) {
        finalHeaders = headers(controllerResult.value);
      }

      if (!isNil(finalHeaders)) {
        for (const [name, value] of Object.entries(finalHeaders)) {
          res.setHeader(name, value);
        }
      }

      await onSuccess(response, res);
    }
  } catch (err) {
    logger.error(err);

    let response;
    if (isMutation(req)) {
      response = {
        data: null,
        error: err,
        message: 'An unhandled error ocurred while executing the request',
        success: false,
        code: 'UNHANDLED_ERROR',
      };
    } else {
      response = {
        data: null,
        error: err,
      };
    }

    res.status(500).send(response);
  }
}

export async function resolveRedirection<R, E extends BaseError<any>>(
  req: Request,
  res: Response,
  controller: (args: any) => AsyncResult<R, E>,
  headers?: { [name: string]: string } | ((args: R) => { [name: string]: string })
): Promise<void> {
  await handleRequestErrors(
    req,
    res,
    async (response, r) => {
      if (isReadable(response.data.stream)) {
        return await new Promise((resolve, reject) => {
          response.data.stream.on('end', () => {
            resolve();
          });
          response.data.stream.on('error', (err: any) => {
            r.end();
            reject(err);
            console.error(err);
          });

          response.data.stream.pipe(r);
        });
      } else {
        r.redirect(response.data);
      }
    },
    controller,
    undefined,
    headers
  );
}

export default async function requestResolver<R, E extends BaseError<any>, PE extends BaseError<any>>(
  req: Request,
  res: Response,
  controller: (args: any) => AsyncResult<R, E>,
  presenter?: (args: R) => AsyncResult<any, PE>,
  headers?: { [name: string]: string } | ((args: R) => { [name: string]: string })
): Promise<void> {
  await handleRequestErrors(
    req,
    res,
    async (response, r) => {
      if (isReadable(response.data)) {
        return await new Promise((resolve, reject) => {
          response.data.on('end', () => {
            resolve();
          });
          response.data.on('error', (err: any) => {
            r.end();
            reject(err);
            console.error(err);
          });

          response.data.pipe(r);
        });
      } else {
        r.status(202).send(response);
      }
    },
    controller,
    presenter,
    headers
  );
}
