/* eslint-disable @typescript-eslint/ban-types */

export type Result<T, E> = Ok<T, E> | Err<T, E>;
export type AsyncResult<T, E> = Promise<Result<T, E>>;

export type OkType<T> = T extends Result<infer U, any> ? U : never;
export type ErrorType<T> = T extends Result<any, infer E> ? E : never;

export type ReturnOkType<T extends Function> = T extends (...args: infer _Args) => Result<infer U, any> ? U : never;
export type ReturnErrorType<T extends Function> = T extends (...args: infer _Args) => Result<any, infer E> ? E : never;

export type AsyncOkType<T> = T extends AsyncResult<infer U, any> ? U : never;
export type AsyncErrorType<T> = T extends AsyncResult<any, infer E> ? E : never;

export type AsyncReturnOkType<T extends Function> = T extends (...args: infer _Args) => AsyncResult<infer U, any>
  ? U
  : never;
export type AsyncReturnErrorType<T extends Function> = T extends (...args: infer _Args) => AsyncResult<any, infer E>
  ? E
  : never;

const IS_RESULT = Symbol('Result');

class Ok<T, E> {
  [IS_RESULT] = true;

  constructor(public readonly value: T) {}

  isOk(): this is Ok<T, E> {
    return true;
  }

  isErr(): this is Err<T, E> {
    return false;
  }

  mapOk<V>(map: (value: T) => V): Result<V, E> {
    return ok(map(this.value));
  }

  async mapOkAsync<V>(map: (value: T) => Promise<V>): Promise<Result<V, E>> {
    return ok(await map(this.value));
  }
}

class Err<T, E> {
  [IS_RESULT] = true;

  public constructor(public readonly error: E) {}

  public isOk(): this is Ok<T, E> {
    return false;
  }

  public isErr(): this is Err<T, E> {
    return true;
  }

  mapOk<V>(_map: (value: T) => V): Result<V, E> {
    return err(this.error);
  }

  async mapOkAsync<V>(_map: (value: T) => Promise<V>): Promise<Result<V, E>> {
    return err(this.error);
  }
}

export function isResult(obj: Result<any, any> | any): obj is Result<any, any> {
  return typeof obj === 'object' && obj[IS_RESULT] === true;
}

export function ok<E>(value: undefined): Ok<undefined, E>;
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export function ok<E>(value: void): Ok<void, E>;
export function ok<T, E>(value: T | Ok<T, any>): Ok<T, E>;

export function ok<T, E>(value: T | Ok<T, any>): Ok<T, E> {
  if (isResult(value)) {
    return value as Ok<T, E>;
  }

  return new Ok(value);
}

export function err<T, E>(error: E | Err<any, E>): Err<T, E> {
  if (isResult(error)) return error as Err<T, E>;

  return new Err(error);
}
