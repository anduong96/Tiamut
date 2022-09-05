# Tiamut

Simple state management (React optional)

## Installation

```bash
npm i --save tiamut
```

# Usage with React

## Basic

```tsx
import { createStoreHook } from "tiamut";

const store = createStoreHook({
  initialState: {
    value: 1,
  },
  actions: {
    addOne(state) {
      state.value += 1;
    },
  },
});

const MyApp = () => {
  const value = store.useSelect((state) => state.value);

  function addOne() {
    // Call this from anywhere
    // Even outside of component
    store.actions.addOne()
  }

  return (
    <div>
      <div>{value}</div>
      <button onClick={addOne}>Add One</button>
    </div>
  );
};
```

## With Preselect

```tsx
import { createStoreHook } from "tiamut";

const store = createStoreHook({
  initialState: {
    value: 1,
  },
  actions: {
    addOne(state) {
      state.value += 1;
    },
  },
}, {
  selectors: {
    withAdditionTen(state) {
      return state + 10
    }
  }
});

const MyApp = () => {
  const value = store.usePreselect.withAdditionTen()
  return <div>{value}</div>;
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
      state.value += 1
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


## Recipes

- [Persisting](..docs/../docs/recipes/persist.md)
- [Debug Changes](..docs/../docs/recipes/log.changes.md)
