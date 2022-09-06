# Enhancer: With Immer

This will modify your actions without having to spread and return new state.

# Example

```tsx
import { createStore, createStoreHook, withImmer } from 'tiamut';

const defaultState = {
  value: 1,
};

const fooStore = createStore(
  withImmer({
    initialState,
    actions: {
      inc(state) {
        state.value += 1;
      },
    },
  }),


const store = createStoreHook(fooStore);

const MyApp = () => {
  const value = store.useSelect((state) => state.value);

  return (
    <div>
      <div>{value}</div>
      <button onClick={store.actions.inc}>Inc One</button>
    </div>
  );
};
```
