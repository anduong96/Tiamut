import { act, renderHook } from '@testing-library/react';

import { createStore } from '../src';
import { createStoreHook } from '../src/react';
import { faker } from '@faker-js/faker';

describe('Hook test', () => {
  const initialState = faker.datatype.number();
  const testStore = createStore({ initialState, actions: {} });

  afterEach(() => {
    testStore.setState(initialState);
    testStore.destroy();
  });

  it('select', () => {
    const store = createStoreHook(testStore);
    const value = renderHook(() => store.useSelect((s) => s));
    expect(value.result.current).toStrictEqual(initialState);
  });

  it('run action', async () => {
    const store = createStoreHook(
      createStore({
        initialState,
        actions: {
          inc(state) {
            return state + 1;
          },
        },
      }),
    );

    const value = renderHook(() => store.useSelect((s) => s));
    expect(value.result.current).toStrictEqual(initialState);
    await act(() => store.actions.inc());
    expect(value.result.current).toStrictEqual(initialState + 1);
  });
});
