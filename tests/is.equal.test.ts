import { isEqual } from '../src/lib/is.equal';

describe('Lib::isEqual test', () => {
  it('is equals when primitive', () => {
    expect(isEqual(true, true)).toBe(true);
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual('', '')).toBe(true);
    expect(isEqual(null, null)).toBe(true);
    expect(isEqual(undefined, undefined)).toBe(true);
  });

  it('is not equals when primitive', () => {
    expect(isEqual(true, false)).toBe(false);
    expect(isEqual(1, 2)).toBe(false);
    expect(isEqual('', '1')).toBe(false);
  });

  it('is not equal when object', () => {
    const obj = {};
    const arr = [];
    expect(isEqual(obj, obj)).toBe(true);
    expect(isEqual(arr, arr)).toBe(true);
  });

  it('is not equal when object', () => {
    expect(isEqual({}, {})).toBe(false);
    expect(isEqual([], [])).toBe(false);
  });
});
