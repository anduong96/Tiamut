import { createStore, createStoreHook } from "../src";

describe("Sanity Test", () => {
  it("works", () => {
    expect(() =>
      createStore({
        initialState: 1,
        actions: {},
      })
    ).not.toThrowError();

    expect(() =>
      createStore({
        initialState: 1,
        actions: {
          ok() {
            return 2;
          },
        },
      })
    ).not.toThrowError();

    expect(() =>
      createStoreHook({
        initialState: 1,
        actions: {},
      })
    ).not.toThrowError();

    expect(() =>
      createStoreHook({
        initialState: 1,
        actions: {
          ok() {
            return 2;
          },
        },
      })
    ).not.toThrowError();
  });
});
