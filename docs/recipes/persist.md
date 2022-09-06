# Persisting

You may want to persist value for whatever reason

<br />
<br />

# Examples

## Browser

```tsx
import { createStore, createStoreHook } from 'tiamut';

const key = 'myKey';
const defaultState = {
  value: 1,
};

function load() {
  const initialState = window.localStorage.getItem(key);
  return initialState ? JSON.parse(initialState) : defaultState;
}

function persist(currentState: typeof defaultState) {
  window.localStorage.setItem(key, JSON.stringify(currentState));
}

const fooStore = createStore({
  initialState: load(),
  actions: {
    inc(state) {
      return {
        ...state,
        value: state.value + 1,
      };
    },
  },
});

fooStore.subscribe(persist);

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

## React-native

```tsx
import { createStore, createStoreHook } from 'tiamut'
import { AsyncStorage, View, Text } from 'react-native';


const key = 'myKey'
const defaultState = {
  value: 1
  isReady: false,
  hasError: false,
}

function persist(currentState: typeof defaultState) {
  AsyncStorage.setItem(key, JSON.stringify(currentState))
}

const fooStore = createStore({
  initialState: defaultState,
  actions: {
    inc(state) {
      return {
        ...state,
        value
      }
    },
    setIsReady(state, value: boolean) {
      return {
        ...state,
        isReady: value
      }
    },
    setHasError(state, value: boolean) {
      return {
        ...state,
        hasError: value
      }
    }
  }
})

fooStore.subscribe(persist)

function loadState() {
  AsyncStorage.getItem(key, (error, result) => {
    if (result) {
      fooStore.actions.setIsReady(true);
      fooStore.setState(JSON.parse(result));
    } else {
      fooStore.actions.setHasError(true);
    }
  })
}

const store = createStoreHook(fooStore)

const Content = () => {
  const value = store.useSelect(state => state.value);
  return (
    <View>
      <Text>My value: {value}</Text>
    </View>
  )
}

const MyApp = () => {
  const isReady = store.useSelect(state => state.isReady);

  React.useEffect(() => {
    loadState();
  }, []);

  if (!isReady) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    )
  }

  return <Content />
}

```
