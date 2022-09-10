import { createCombinedStoresHook, createStore } from '../src';

import { act } from 'react-dom/test-utils';
import { faker } from '@faker-js/faker';
import { renderHook } from '@testing-library/react';

describe('Combined hook context test', () => {
  it('Renders correctly', async () => {
    const initialAlpha = faker.datatype.number();
    const betaValue = faker.datatype.number();
    const alphaStore = createStore({
      initialState: initialAlpha,
      actions: {
        incOne(state) {
          return state + 1;
        },
      },
    });

    const betaStore = createStore({
      initialState: { value: betaValue },
      actions: {},
    });

    const store = createCombinedStoresHook({
      alpha: alphaStore,
      beta: betaStore,
    });

    act(() => store.actions.alpha.incOne());

    const value = renderHook(() => {
      return store.useSelect((s) => s.alpha);
    });

    expect(value.result.current).toStrictEqual(initialAlpha + 1);
  });
});
