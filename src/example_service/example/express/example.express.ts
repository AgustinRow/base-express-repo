import type { Request, Response } from 'express';
import { inject } from 'inversify';
import { BaseHttpController, controller, httpPost, request, response } from 'inversify-express-utils';
import requestResolver from '../../../utils/express/request_resolver.js';
import ExampleControllers from '../controllers/example.js';
import { validateInputs } from '../../../utils/validate_input.js';
import { CreateExampleSchema } from './schema.validation.js';

@controller('/example')
export class ExampleExpressControllers extends BaseHttpController {
  constructor(@inject('ExampleControllers') private readonly exampleControllers: ExampleControllers) {
    super();
  }

  @httpPost('', validateInputs(CreateExampleSchema))
  async createExample(@request() req: Request, @response() res: Response): Promise<void> {
    return await requestResolver(req, res, this.exampleControllers.createExample);
  }
}
