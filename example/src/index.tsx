import * as React from "react";
import * as ReactDOM from "react-dom";
import create from "./reducer-context-hook";

interface State {
  count: number;
}

type Action = { type: 'reset' } | { type: 'increment' } | { type: 'decrement' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      throw new Error();
  }
}

const initialState: State = {
  count: 0
};

const { StoreContextProvider, useMappedState, useDispatch } = create(reducer, initialState);

function App() {
  return (
    <StoreContextProvider>
      <Counter />
    </StoreContextProvider>
  )
}

function Counter() {
  const { count } = useMappedState(state => ({
    count: state.count
  }), []);
  const dispatch = useDispatch();
  const increment = React.useCallback(() => dispatch({type: "increment"}), []);
  return (
    <>
      <p>{count}</p>
      <button onClick={increment}>increment</button>
    </>
  )
}

ReactDOM.render(<App />, document.querySelector("#root"));
