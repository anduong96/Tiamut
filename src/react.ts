/* eslint-disable react-hooks/rules-of-hooks */
import type {
  ActionsMap,
  CreateStoreFn,
  CreateStoreHookOptions,
  EqualityFn,
  Listener,
  MergeState,
  Selector,
  Store,
  StoreMap,
  StoreOrStoreParam,
} from './types';

import React from 'react';
import { createStore } from './create.store';
import { isEqual } from './lib/is.equal';
import { mergeBy } from './lib/merge.by';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';

function isStore<S, A extends ActionsMap<S>>(
  store: Store<S, A> | Parameters<CreateStoreFn<S, A>>[0],
): store is Store<S, A> {
  return 'getState' in store;
}

export function createCombinedStoresHook<S extends StoreMap>(
  storeMap: S,
  options?: CreateStoreHookOptions,
) {
  type M = MergeState<S>;
  type TListener = Listener<M, string>;
  const listeners = new Set<TListener>();
  const equalFn = options?.useShallowEqual ? isEqual : undefined;

  let state = mergeBy(storeMap, (store: Store<M>) => store.getState()) as M;

  /**
   * It takes the previous state, the store key, and the action name, and then it loops through all the
   * listeners and calls them with the current state, the previous state, and the action key
   */
  function publish(previousState: M, storeK: string, actionName: string) {
    const actionK = `${storeK}/${actionName}`;
    for (const listener of Array.from(listeners)) {
      listener(state, previousState, actionK);
    }
  }

  /**
   * It takes the store's key, the action's name, and the store's state, and then updates the state
   * object with the new store's state
   */
  function updateState(
    storeK: string,
    actionName: string,
    storeState: unknown,
  ) {
    const previous = state;
    const nextState = {
      ...state,
      [storeK]: storeState,
    };

    state = nextState;
    publish(previous, storeK, actionName);
  }

  /**
   * It subscribes to all the stores in the storeMap and updates the state of the store in the storeMap
   */
  function createStoreSubscriptions() {
    for (const storeK of Object.keys(storeMap)) {
      storeMap[storeK]?.subscribe((storeState, _, actionName) => {
        updateState(storeK, actionName as string, storeState);
      });
    }
  }

  /**
   * Subscribe takes a listener and returns a function that removes that listener.
   */
  function subscribe(listener: Listener<M, string>) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  /**
   * It returns the value of the variable state.
   */
  function getState() {
    return state;
  }

  /**
   * It returns a value that is derived from the state of the store, and it will automatically update
   * whenever the state of the store changes
   */
  function makeHook<R>(selector: Selector<M, R>, equalityFn?: EqualityFn<R>) {
    const value = useSyncExternalStoreWithSelector(
      subscribe,
      getState,
      getState,
      selector,
      equalityFn ?? equalFn,
    );

    React.useDebugValue(value);
    return value;
  }

  /**
   * `select` is a function that takes a selector function and an optional equality function and returns
   * value of the selector function
   */
  function select<T>(selector: Selector<M, T>, equalityFn?: EqualityFn<T>): T {
    return makeHook<T>(selector, equalityFn) as unknown as T;
  }

  /**
   * It takes a map of stores and returns a map of actions
   */
  function modActions(): { [K in keyof S]: S[K]['actions'] } {
    return mergeBy(storeMap, (store) => store.actions);
  }

  createStoreSubscriptions();

  return {
    useSelect: select,
    actions: modActions(),
    getState,
    subscribe,
  };
}

export function createStoreHook<State, A extends ActionsMap<State>>(
  _store: StoreOrStoreParam<State, A>,
  options?: CreateStoreHookOptions,
) {
  const store = isStore(_store) ? _store : createStore(_store);
  const equalFn = options?.useShallowEqual ? isEqual : undefined;

  /**
   * It returns a value that is always in sync with the value returned by the selector function
   */
  function makeHook<R>(
    selector: Selector<State, R>,
    equalityFn?: EqualityFn<R>,
  ) {
    const value = useSyncExternalStoreWithSelector(
      store.subscribe,
      store.getState,
      store.getState,
      selector,
      equalityFn ?? equalFn,
    );

    React.useDebugValue(value);
    return value;
  }

  /**
   * "It returns a hook that returns the value of the selector function."
   */
  function select<T>(
    selector: Selector<State, T>,
    equalityFn?: EqualityFn<T>,
  ): T {
    return makeHook<T>(selector, equalityFn) as unknown as T;
  }

  return {
    useSelect: select,
    actions: store.actions,
    getState: store.getState,
    subscribe: store.subscribe,
  };
}
