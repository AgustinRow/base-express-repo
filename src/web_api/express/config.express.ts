import type { Request, Response } from 'express';
import { BaseHttpController, controller, httpGet, request, response } from 'inversify-express-utils';

@controller('/_config')
export class ConfigExpressControllers extends BaseHttpController {
  @httpGet('/status')
  async getAppConfig(@request() req: Request, @response() res: Response): Promise<string> {
    return 'online';
  }
}
