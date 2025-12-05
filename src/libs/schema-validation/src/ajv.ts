import { Ajv, JSONSchemaType, ValidateFunction } from 'ajv';
import { Result, ok, err } from '../../result/index.js';
import { InvalidObjectSchemaError } from '../../errors/index.js';

const ajv = new Ajv({
  allErrors: true,
  coerceTypes: false,
});

function getValidator<T>(schema: JSONSchemaType<T>): ValidateFunction<T> {
  return ajv.compile(schema) as ValidateFunction<T>;
}

export function ajvValidator<T>(schema: JSONSchemaType<T>, input: unknown): Result<void, InvalidObjectSchemaError> {
  const validator = getValidator(schema);

  const isValid = validator(input);

  if (isValid) {
    return ok();
  } else {
    return err(
      new InvalidObjectSchemaError(
        'The object that you verify does not satisfied the validation schema',
        validator.errors
      )
    );
  }
}
