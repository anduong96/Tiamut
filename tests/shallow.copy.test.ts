import { faker } from '@faker-js/faker';
import { shallowCopy } from '../src/lib/shallow.copy';

describe('Lib:shallowCopy Test', () => {
  it('copy', () => {
    const target = faker.science.chemicalElement();
    const result = shallowCopy(target);
    expect(target).not.toBe(result);
    expect(target).toStrictEqual(result);
  });

  it('copy array', () => {
    const length = faker.datatype.number({ min: 1, max: 100 });
    const target = Array.from({ length: length }).map(() =>
      faker.science.chemicalElement(),
    );

    const result = shallowCopy(target);
    expect(target).not.toBe(result);
    expect(target).toStrictEqual(result);
  });

  it('do not copy null', () => {
    const target = null;
    const result = shallowCopy(target);
    expect(target).toBe(result);
  });

  it('do not copy number', () => {
    const target = faker.datatype.number();
    const result = shallowCopy(target);
    expect(target).toBe(result);
    expect(target).toStrictEqual(result);
  });

  it('do not copy string', () => {
    const target = faker.animal.bear();
    const result = shallowCopy(target);
    expect(target).toBe(result);
    expect(target).toStrictEqual(result);
  });
});
