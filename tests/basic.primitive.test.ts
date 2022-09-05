import { createStore } from '../src';

describe('Basic primitive test', () => {
  const init = 1;
  const store = createStore({
    initialState: init,
    actions: {
      add(state, value: number) {
        return state + value;
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
    expect(store.getState()).toStrictEqual(2);
    expect(init).not.toStrictEqual(store.getState());
  });

  it('Trigger subscription', () => {
    const subscription = jest.fn();
    store.subscribe(subscription);
    store.actions.add(1);
    expect(subscription).toHaveBeenCalled();
    store.actions.add(1);
    store.actions.add(1);
    expect(subscription).toHaveBeenCalledTimes(3);
    expect(store.getState()).toStrictEqual(4);
    expect(init).not.toStrictEqual(store.getState());
  });
});
