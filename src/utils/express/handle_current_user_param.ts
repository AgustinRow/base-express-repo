import { AsyncResult } from '../../libs/result/index.js';

// TODO: [TYPES] Improve types
export default function handleCurrentUserRouteParam<Args extends Record<string, any>>(
  wrappedFunction: (arg: Args) => AsyncResult<any, any>,
  paramName: keyof Args,
  targetParamName?: string
): (input: Args) => AsyncResult<any, any> {
  return async input => {
    const payload = input;
    if (input[paramName] === 'me') {
      // @ts-expect-error
      payload[targetParamName ?? paramName] = undefined;
    }
    const response = await wrappedFunction(payload);
    return response;
  };
}
