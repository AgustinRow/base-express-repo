import { AsyncResult, err, ok, Result } from '../libs/result/index.js';

export type ResultListPresenterFromIds<GetByIdFn> = GetByIdFn extends (id: string) => Promise<Result<infer R, infer E>>
  ? (ids: string[]) => AsyncResult<R[], E>
  : never;

export default function resultListPresenterFromIds<R, E>(
  getById: (id: string) => Promise<Result<R, E>>
): (ids: string[]) => AsyncResult<R[], E> {
  return async (ids: string[]) => {
    const results = await Promise.all(ids.map(async id => await getById(id)));
    const items = [];
    for (const result of results) {
      if (result.isErr()) {
        return err(result.error);
      }

      items.push(result.value);
    }

    return ok(items);
  };
}
