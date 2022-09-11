import { mergeBy } from '../src/lib/merge.by';

describe('Lib::mergeBy Test', () => {
  it('merges', () => {
    const target = {
      a: { value: 1 },
      b: { value: 2 },
    };

    const result = mergeBy(target, (item) => item.value);
    expect(result).toStrictEqual({ a: 1, b: 2 });
  });

  it('do not merge', () => {
    const target = undefined;
    const result = mergeBy(target, (v) => v);
    expect(result).toStrictEqual({});
  });
});
