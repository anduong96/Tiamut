/* eslint-disable react-hooks/rules-of-hooks */
import type {
  ActionsMap,
  CombinedSelectorsMap,
  CreateStoreFn,
  EqualityFn,
  Listener,
  MergeState,
  Selector,
  SelectorsMap,
  Store,
  StoreMap,
  StoreOrStoreParam,
} from './types';

import React from 'react';
import { createStore } from './create.store';
import { mergeBy } from './lib/merge.by';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';

function isStore<S, A extends ActionsMap<S>>(
  store: Store<S, A> | Parameters<CreateStoreFn<S, A>>[0],
): store is Store<S, A> {
  return 'getState' in store;
}

export function createCombinedStoresHook<
  S extends StoreMap,
  O extends CombinedSelectorsMap<S>,
>(storeMap: S, options?: { selectors: O }) {
  const { selectors } = options ?? {};
  type M = MergeState<S>;

  function subscribe(listener: Listener<unknown, unknown>) {
    const removeList = Object.values(storeMap).map((store) =>
      store.subscribe(listener),
    );

    return () => {
      removeList.forEach((fn) => fn());
    };
  }

  function getState() {
    return mergeBy(storeMap, (store: Store<unknown>) => store.getState()) as {
      [K in keyof S]: ReturnType<S[K]['getState']>;
    };
  }

  function makeHook(selector: Selector<M>, equalityFn?: EqualityFn<M>) {
    const value = useSyncExternalStoreWithSelector(
      subscribe,
      getState,
      getState,
      selector,
      equalityFn,
    );

    React.useDebugValue(value);
    return value;
  }

  function select<T>(selector: Selector<M, T>, equalityFn?: EqualityFn<M>): T {
    return makeHook(selector, equalityFn) as unknown as T;
  }

  function modSelectors() {
    return mergeBy(selectors, (selector) => () => makeHook(selector));
  }

  function modActions(): { [K in keyof S]: S[K]['actions'] } {
    return mergeBy(storeMap, (store) => store.actions);
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
  O extends SelectorsMap<State>,
>(_store: StoreOrStoreParam<State, A>, options?: { selectors?: O }) {
  const store = isStore(_store) ? _store : createStore(_store);
  const { selectors } = options ?? {};

  function makeHook(selector: Selector<State>, equalityFn?: EqualityFn<State>) {
    const value = useSyncExternalStoreWithSelector(
      store.subscribe,
      store.getState,
      store.getState,
      selector,
      equalityFn,
    );

    React.useDebugValue(value);
    return value;
  }

  function select<T>(
    selector: Selector<State, T>,
    equalityFn?: EqualityFn<State>,
  ): T {
    return makeHook(selector, equalityFn) as unknown as T;
  }

  function modSelectors() {
    return mergeBy(selectors, (selector) => () => makeHook(selector)) as {
      [K in keyof O]: () => ReturnType<O[K]>;
    };
  }

  return {
    useSelect: select,
    usePreselect: modSelectors(),
    actions: store.actions,
  };
}
