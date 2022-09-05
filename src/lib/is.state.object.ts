import { Action } from '../types';

/**
 * If the target is not a function, then it is a state object.
 */
export function isStateObject<S>(target: S | Action<S>): target is S {
  return typeof target !== 'function';
}
