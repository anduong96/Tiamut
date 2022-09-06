# Enhancer: With Shallow Copy

This enhancer will allow you to return the state given without the need to creating a new instance.

# Example

```tsx
import { createStore, createStoreHook, withShallowCopy } from 'tiamut';

const defaultState = {
  value: 1,
};

const fooStore = createStore(
  withShallowCopy({
    initialState,
    actions: {
      inc(state) {
        state.value += 1;
        return state;
      },
    },
  }),
);

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
