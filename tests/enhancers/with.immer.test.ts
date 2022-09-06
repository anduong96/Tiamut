import { createStore, withImmer, withShallow } from '../../src';

import { faker } from '@faker-js/faker';
import { makeElement } from '../utils/make.element';

describe('Enhancers: withImmer', () => {
  it('updates array correctly', () => {
    const length = faker.datatype.number({ min: 5, max: 10 });
    const init = Array.from({ length }).map(makeElement);
    const store = createStore(
      withImmer({
        initialState: init,
        actions: {
          addElement(state, element: ReturnType<typeof makeElement>) {
            state.unshift(element);
          },
          shiftElement(state) {
            state.shift();
          },
        },
      }),
    );

    expect(store.getState()).toStrictEqual(init);
    const newElement = makeElement();
    store.actions.addElement(newElement);
    expect(store.getState()).not.toStrictEqual(init);
    expect(store.getState()[0]).toStrictEqual(newElement);

    store.actions.shiftElement();
    expect(store.getState()).toStrictEqual(init);
    expect(store.getState()[0]).not.toStrictEqual(newElement);
  });

  it('updates object correctly', () => {
    const init = { value: faker.datatype.number() };
    const store = createStore(
      withImmer({
        initialState: init,
        actions: {
          add(state, value: number) {
            state.value += value;
          },
        },
      }),
    );

    expect(store.getState()).toStrictEqual(init);
    const addingValue = faker.datatype.number();
    store.actions.add(addingValue);
    expect(store.getState()).toStrictEqual({
      value: addingValue + init.value,
    });
  });
});
