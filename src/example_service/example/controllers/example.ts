//import { inject } from 'inversify';
import abind from 'abind';
import { AsyncResult, /* err, */ ok } from '../../../libs/result/index.js';
import { UnknownError, NotFoundError } from '../../../libs/errors/index.js';
import { CreateExampleInput } from '../express/schema.validation.js';
import logger from '../../../utils/logger.js';

export default class ExampleControllers {
  constructor() /* @inject('ExampleUseCases') private readonly exampleUseCase: ExampleUseCases */ {
    abind(this);
  }

  async createExample(input: CreateExampleInput): AsyncResult<CreateExampleInput, UnknownError | NotFoundError> {
    logger.debug('Input: ', input);
    return ok(input);
  }
}
