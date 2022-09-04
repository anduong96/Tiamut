import { createCombinedStoresHook, createStore } from "../src";

import { faker } from "@faker-js/faker";
import { renderHook } from "@testing-library/react";

describe("Combined hook test", () => {
  const initialAlpha = faker.datatype.number();
  const betaValue = faker.datatype.number();
  const alphaStore = createStore({
    initialState: initialAlpha,
    actions: {},
  });

  const betaStore = createStore({
    initialState: { value: betaValue },
    actions: {},
  });

  afterEach(() => {
    alphaStore.resetState();
    betaStore.resetState();
    alphaStore.destroy();
    betaStore.destroy();
  });

  it("select", () => {
    const store = createCombinedStoresHook({
      alpha: alphaStore,
      beta: betaStore,
    });

    const value = renderHook(() => store.useSelect((s) => s.alpha));
    expect(value.result.current).toStrictEqual(initialAlpha);
  });

  it("creates selector", () => {
    const store = createCombinedStoresHook(
      {
        alpha: alphaStore,
        beta: betaStore,
      },
      {
        selectors: {
          together(state) {
            return state.alpha + state.beta.value;
          },
        },
      }
    );

    const value = renderHook(() => store.usePreselect.together());
    expect(value.result.current).toStrictEqual(betaValue + initialAlpha);
  });
});
