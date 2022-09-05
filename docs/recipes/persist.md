## Test


## Browser
```tsx
import { createStore, createStoreHook } from 'tiamut'

const key = 'myKey'
const defaultState = {
  value: 1
}

function load() {
  const initialState = window.localStorage.getItem(key)
  return initialState ? JSON.parse(initialState) : defaultState
}

function persist(currentState: typeof defaultState) {
  window.localStorage.setItem(key, JSON.stringify(currentState))
}

const fooStore = createStore(
  initialState: load(),
  actions: {
    inc(state) {
      state.value += 1;
    }
    // your actions
  }
)

fooStore.subscribe(persist)

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
