//import { inject } from 'inversify';
//import { isNil } from 'lodash-es';
import abind from 'abind';
import { AsyncResult, ok } from '../../../libs/result/index.js';
import { NotFoundError, UnknownError } from '../../../libs/errors/index.js';

export default class ExampleUseCases {
  constructor() {
    abind(this);
  }

  async createExample(input: string): AsyncResult<string, UnknownError | NotFoundError> {
    return ok('');
  }
}
