import { faker } from '@faker-js/faker';

/**
 * It returns an object with two properties, id and value, where id is a string and value is a number
 * @returns An object with two properties, id and value.
 */
export function makeElement() {
  return {
    id: faker.datatype.string(),
    value: faker.datatype.number(),
  };
}
