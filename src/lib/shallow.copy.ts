import { mergeBy } from './merge.by';

/**
 * It returns a shallow copy of the target object
 * @param {T} target - T
 * @returns A shallow copy of the target object.
 */
export function shallowCopy<T>(target: T): T {
  if (!target || typeof target !== 'object') {
    return target;
  }

  if (Array.isArray(target)) {
    const copy = [];
    for (let i = 0; i < target.length; i++) {
      copy[i] = target[i];
    }

    return copy as T;
  } else {
    return mergeBy(target, (v) => v) as T;
  }
}
