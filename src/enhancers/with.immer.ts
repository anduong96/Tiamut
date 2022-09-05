import { DropFirst } from 'src/types';
import { mergeBy } from '../lib/merge.by';
import produce from 'immer';

/**
 * Add immer super power to store
 */
export function withImmer<
  S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  A extends { [K: string]: (state: S, ...params: any[]) => S | void },
>(param: { initialState: S; actions: A }) {
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
