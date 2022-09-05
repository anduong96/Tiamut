import { createStore } from '../src';
import { faker } from '@faker-js/faker';

describe('Basic object test', () => {
  const init = { test: faker.datatype.number() };
  const store = createStore({
    initialState: init,
    actions: {
      add(state, value: number) {
        state.test += value;
        return state;
      },
    },
  });

  afterEach(() => {
    store.setState(init);
    store.destroy();
  });

  it('Update state', () => {
    expect(store.getState()).toStrictEqual(init);
    store.actions.add(1);
    expect(store.getState()).toStrictEqual({ test: 1 + init.test });
    expect(store.getState()).not.toStrictEqual(init);
  });

  it('Trigger subscription', () => {
    const subscription = jest.fn();
    store.subscribe(subscription);
    store.actions.add(1);
    expect(subscription).toHaveBeenCalled();
    store.actions.add(1);
    store.actions.add(1);
    expect(subscription).toHaveBeenCalledTimes(3);
    expect(store.getState()).toStrictEqual({ test: 3 + init.test });
    expect(store.getState()).not.toStrictEqual(init);
  });

  it('Remove subscription', () => {
    const listen = jest.fn();
    const toBeRemove = jest.fn();
    store.subscribe(listen);
    const remove = store.subscribe(toBeRemove);
    remove();
    store.actions.add(1);

    expect(listen).toHaveBeenCalled();
    expect(toBeRemove).not.toHaveBeenCalled();
  });
});
