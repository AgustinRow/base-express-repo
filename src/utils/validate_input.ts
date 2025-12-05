import type { Request, Response, NextFunction } from 'express';
import { JSONSchemaType } from 'ajv';
import { ajvValidator } from '../libs/schema-validation/src/ajv.js';
import { InvalidInputErrorCodes } from '../libs/errors/src/invalid_input_error.js';

type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void;

export function validateInputs<T>(schema: JSONSchemaType<T>): ExpressMiddleware {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    let payload;

    if (req.method === 'GET') {
      payload = { ...req.params, ...req.query };
    } else if (req.method === 'POST' || req.method === 'DELETE' || req.method === 'PUT' || req.method === 'PATCH') {
      payload = { ...req.params, ...req.query, ...req.body };
    }

    const validationResult = ajvValidator(schema, payload);

    if (validationResult.isErr()) {
      const error = validationResult.error;

      return res.status(400).json({
        message: 'Request input validation failed.',
        errors: error.originalError,
        code: InvalidInputErrorCodes.INVALID_INPUT_ERROR,
      });
    }

    // Infering types to the inputs and assigning them to req.validatedPayload
    const validatedPayload: T = payload as T;
    (req as any).validatedPayload = validatedPayload;

    next();
  };
}
