## Test


## Browser
```tsx
import { createStore, createStoreHook } from 'tiamut'

const defaultState = {
  value: 1
}

const fooStore = createStore(
  initialState,
  actions: {
    inc(state) {
      state.value += 1;
    }
  }
)

function debugChanges(
  current: typeof defaultState,
  previous: typeof defaultState,
  actionName: string
) {
  console.log(actionName, { current, previous })
}

fooStore.subscribe(debugChanges)
const store = createStoreHook(fooStore)

const MyApp = () => {
  const value = store.useSelect(state => state.value)

  return (
    <div>
      <div>{value}</div>
      <button onClick={store.actions.inc}>Inc One</button>
    </div>
  )
}

```
