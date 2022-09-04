import type {
  Action,
  ActionsMap,
  Listener,
  ModActionMap,
  Store,
} from "./types";

import produce from "immer";

/**
 * It takes an initial state and an actions object, and returns an object with a setState function, a
 * getState function, a subscribe function, and an actions object
 */
export function createStore<S, A extends ActionsMap<S>>(param: {
  initialState: S;
  actions: A;
}): Store<S, A> {
  type ActionNames = keyof typeof actions;
  type TListener = Listener<S, ActionNames>;
  const { initialState, actions } = param;
  const listeners = new Set<TListener>();
  let state = initialState;

  /**
   * Subscribe takes a listener and returns an object with a remove method.
   */
  function subscribe(listener: TListener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  /**
   * It clears the listeners Map
   */
  function destroy() {
    listeners.clear();
  }

  /**
   * The function getState() returns the value of the variable state
   * @returns The state variable is being returned.
   */
  function getState() {
    return state;
  }

  /**
   * `resetState` is a function that sets the state to the initial state
   */
  function resetState() {
    setState(initialState);
  }

  /**
   * If the target is not a function, then it is a state object.
   */
  function isStateObject(target: S | Action<S>): target is S {
    return typeof target !== "function";
  }

  /**
   * It takes a new state or an action function that produces a new state, and returns the new state
   */
  function setState(
    nextState: S | Action<S>,
    actionName?: keyof typeof actions
  ): S {
    const newState = isStateObject(nextState)
      ? nextState
      : produce(state, nextState);

    const previousState = state;
    state = newState;
    publish(previousState, actionName || "setState");

    return state;
  }

  /**
   * For each listener in the listeners array, call the listener function with the current state and
   * the previous state.
   */
  function publish(previousState: S, actionName: ActionNames) {
    for (const listener of Array.from(listeners)) {
      listener(state, previousState, actionName);
    }
  }

  const modActions = {} as ModActionMap<S, A>;
  for (const actionKey of Object.keys(actions)) {
    const action = actions[actionKey];
    if (action) {
      const key = actionKey as keyof A;
      modActions[key] = (...params: unknown[]) => {
        setState((draft) => action(draft, ...params), actionKey);
      };
    }
  }

  const api = {
    actions: modActions,
    destroy,
    subscribe,
    resetState,
    getState,
    setState,
  };

  return api;
}
