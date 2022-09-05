import { createStore, createStoreHook } from '../src';

describe('Sanity Test', () => {
  it('works', () => {
    expect(() =>
      createStore({
        initialState: 1,
        actions: {},
      }),
    ).not.toThrowError();

    expect(() =>
      createStore({
        initialState: 1,
        actions: {
          ok() {
            return 2;
          },
        },
      }),
    ).not.toThrowError();

    expect(() =>
      createStoreHook({
        initialState: 1,
        actions: {},
      }),
    ).not.toThrowError();

    expect(() =>
      createStoreHook({
        initialState: 1,
        actions: {
          ok() {
            return 2;
          },
        },
      }),
    ).not.toThrowError();
  });

  it('Resets state', () => {
    const initialState = { test: 1 };
    const store = createStore({
      initialState,
      actions: {},
    });

    expect(store.getState()).toStrictEqual(initialState);
    expect(store.getInitialState()).toStrictEqual(initialState);
    store.setState({ test: 2 });
    expect(store.getState()).not.toStrictEqual(initialState);
    expect(store.getState()).not.toStrictEqual(store.getInitialState());
    expect(store.getInitialState()).toStrictEqual(initialState);
    store.setState(store.getInitialState());
    expect(store.getState()).toStrictEqual(initialState);
    expect(store.getInitialState()).toStrictEqual(initialState);
  });
});
