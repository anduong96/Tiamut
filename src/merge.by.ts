/**
 * It takes an object and a function that takes a value and returns a value, and returns an object with
 * the same keys as the original object, but with the values transformed by the function.
 */
export function mergeBy<
  T extends object,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CB extends (value: T[keyof T], key: keyof T) => any,
>(target: T | undefined, getValue: CB) {
  const result = {} as { [key in keyof T]: ReturnType<CB> };

  if (!target) {
    return result;
  }

  for (const _key of Object.keys(target)) {
    const key = _key as keyof T;
    result[key] = getValue(target[key], key);
  }

  return result;
}
