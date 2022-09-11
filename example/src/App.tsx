import './App.css';

import * as React from 'react';

import { createStore, createStoreHook } from 'tiamut';

const store = createStoreHook(
  createStore({
    initialState: 1,
    actions: {
      inc(state) {
        return state + 1;
      },
    },
  }),
);

function App() {
  const value = store.useSelect((state) => state);
  const renderCt = React.useRef(0);

  React.useEffect(() => {
    renderCt.current += 1;
  });

  return (
    <div className="app">
      <div className="content">
        <div className="value">Value: {value}</div>
        <div className="value">Render Count: {renderCt.current}</div>
        <br />
        <button onClick={store.actions.inc}>Inc</button>
      </div>
    </div>
  );
}

export default App;
