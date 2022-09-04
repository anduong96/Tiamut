import {
  ActionsMap,
  CombinedSelectorsMap,
  CreateStoreFn,
  EqualityFn,
  Listener,
  MergeState,
  ModCombinedSelectorsMap,
  ModSelectorsMap,
  Selector,
  SelectorsMap,
  Store,
  StoreMap,
  StoreOrStoreParam,
} from "./types";

import React from "react";
import { createStore } from "./create.store";
import { mergeBy } from "./merge.by";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";

function isStore<S, A extends ActionsMap<S>>(
  store: Store<S, A> | Parameters<CreateStoreFn<S, A>>[0]
): store is Store<S, A> {
  return "getState" in store;
}

export function createCombinedStoresHook<
  S extends StoreMap,
  O extends CombinedSelectorsMap<S>
>(storeMap: S, options?: { selectors: O }) {
  const { selectors } = options ?? {};
  type M = MergeState<S>;
  type Sel = NonNullable<typeof selectors>;

  function subscribe(listener: Listener<any, any>) {
    const removeList = Object.values(storeMap).map((store) =>
      store.subscribe(listener)
    );

    return () => {
      removeList.forEach((fn) => fn());
    };
  }

  function getState() {
    return mergeBy(storeMap, (store) => store.getState());
  }

  function makeHook(selector: Selector<M>, equalityFn?: EqualityFn<M>) {
    const value = useSyncExternalStoreWithSelector(
      subscribe,
      getState,
      getState,
      selector,
      equalityFn
    );

    React.useDebugValue(value);
    return value;
  }

  function select<T>(selector: Selector<M, T>, equalityFn?: EqualityFn<M>): T {
    return makeHook(selector, equalityFn) as any as T;
  }

  function modSelectors() {
    const result = {} as ModCombinedSelectorsMap<Sel>;
    if (!selectors) {
      return result;
    }

    for (const _selectorK of Object.keys(selectors)) {
      const selectorK = _selectorK as keyof typeof selectors;
      const selector = selectors[selectorK];
      if (selector) {
        result[selectorK] = () => makeHook(selector) as ReturnType<O[keyof O]>;
      }
    }

    return result;
  }

  function modActions() {
    const result = {} as { [K in keyof S]: S[K]["actions"] };
    for (const _storeK of Object.keys(storeMap)) {
      const storeK = _storeK as keyof S;
      const storeActions = storeMap[storeK]!.actions;
      result[storeK] = storeActions;
    }

    return result;
  }

  return {
    useSelect: select,
    usePreselect: modSelectors(),
    actions: modActions(),
  };
}

export function createStoreHook<
  State,
  A extends ActionsMap<State>,
  O extends SelectorsMap<State>
>(_store: StoreOrStoreParam<State, A>, options?: { selectors?: O }) {
  const store = isStore(_store) ? _store : createStore(_store);
  const { selectors } = options ?? {};
  type Sel = NonNullable<typeof selectors>;

  function makeHook(selector: Selector<State>, equalityFn?: EqualityFn<State>) {
    const value = useSyncExternalStoreWithSelector(
      store.subscribe,
      store.getState,
      store.getState,
      selector,
      equalityFn
    );

    React.useDebugValue(value);
    return value;
  }

  function select<T>(
    selector: Selector<State, T>,
    equalityFn?: EqualityFn<State>
  ): T {
    return makeHook(selector, equalityFn) as any as T;
  }

  function modSelectors() {
    const result = {} as ModSelectorsMap<Sel>;
    if (!selectors) {
      return result;
    }

    for (const _selectorK of Object.keys(selectors)) {
      const selectorK = _selectorK as keyof typeof selectors;
      const selector = selectors[selectorK];
      if (selector) {
        result[selectorK] = () => makeHook(selector) as ReturnType<O[keyof O]>;
      }
    }

    return result;
  }

  return {
    useSelect: select,
    usePreselect: modSelectors(),
    actions: store.actions,
  };
}
