import type { DropFirst } from '../types';
import type { IProduce } from 'immer/dist/internal';
import { mergeBy } from '../lib/merge.by';

let produce: IProduce;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  produce = require('immer').default;
  // eslint-disable-next-line no-empty
} catch (e) {}

/**
 * Add immer super power to store
 */
export function withImmer<
  S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  A extends { [K: string]: (state: S, ...params: any[]) => S | void },
>(param: { initialState: S; actions: A }) {
  if (!produce) {
    throw new Error('immer module is missing!');
  }

  const modActions = mergeBy(
    param.actions,
    (action) =>
      (state: S, ...params: DropFirst<Parameters<typeof action>>) => {
        return produce(state, (draft: S) => action(draft, ...params));
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any as {
    [K in keyof A]: (...params: Parameters<A[K]>) => S;
  };

  return {
    actions: modActions,
    initialState: param.initialState,
  };
}
