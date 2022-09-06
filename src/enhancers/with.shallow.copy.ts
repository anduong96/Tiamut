import { ActionsMap, CreateStoreParam, DropFirst } from '../types';

import { mergeBy } from '../lib/merge.by';
import { shallowCopy } from '../lib/shallow.copy';

/**
 * Add immer super power to store
 */
export function withShallow<S, A extends ActionsMap<S>>(
  param: CreateStoreParam<S, A>,
) {
  const modActions = mergeBy(
    param.actions,
    (action) =>
      (state: S, ...params: DropFirst<Parameters<typeof action>>) => {
        return action(shallowCopy(state), ...params);
      },
  );

  return {
    actions: modActions as A,
    initialState: param.initialState,
  };
}
