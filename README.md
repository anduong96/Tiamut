# Tiamut

Simple state management (React optional)

## Example

https://githubbox.com/anduong96/Tiamut/tree/main/example

## Installation

```bash
npm i --save tiamut
```

# Usage with React

## Basic

```tsx
import { createStoreHook, createStore } from 'tiamut';

const store = createStoreHook(
  createStore({
    initialState: {
      value: 1,
    },
    actions: {
      addOne(state) {
        const nextState = { ...nextState }
        nextState.value += 1;
        return nextState;
      },
    },
  }),
);

const MyApp = () => {
  const value = store.useSelect((state) => state.value);

  function addOne() {
    // Call this from anywhere
    // Even outside of component
    store.actions.addOne();
  }

  return (
    <div>
      <div>{value}</div>
      <button onClick={addOne}>Add One</button>
    </div>
  );
};
```

## With slices

```tsx
import { createStore, createCombinedStoreHook } from "tiamut";

const foo = createStore({
  initialState: {
    value: 1,
  },
});

const bar = createStore({
  initialState: {
    value: 2,
  },
  actions: {
    addOne(state) {
      const nextState = { ...state };
      nextState.value += 1
      return nextState;
    }
  }
});

const store = createCombinedStoresHook({
  foo,
  bar,
});

const MyApp = () => {
  const value = store.useSelect((state) => state.foo.value);

  function handleAction() {
    store.actions.bar.addOne();
    // or
    // bar.actions.addOne();
  }

  return (
    <div>
      <div>{value}</div>
      <button onClick={handleAction}>Add One</button>
    </div>;
  )
};
```



## With Preselect

```tsx
import { createStoreHook } from 'tiamut';

const store = createStoreHook(
  {
    initialState: 1,
    actions: {},
  },
  {
    selectors: {
      withAdditionTen(state) {
        return state + 10;
      },
    },
  },
);

const MyApp = () => {
  const value = store.usePreselect.withAdditionTen();
  return <div>{value}</div>;
};
```

## Enhancers
- [With Shallow](.docs/enhancers/with.shallow.md)
- [With Immer](.docs/enhancers/with.immer.md)

## Recipes

- [Persisting](./docs/recipes/persist.md)
- [Debug Changes](./docs/recipes/log.changes.md)
