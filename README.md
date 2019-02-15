# Reducer Context Hook

[![CircleCI](https://circleci.com/gh/sosukesuzuki/reducer-context-hook/tree/master.svg?style=svg)](https://circleci.com/gh/sosukesuzuki/reducer-context-hook/tree/master)

A function that provides hooks to manage state with useReducer and useContext.

## Usage

### Create

Creates instance of Hooks and `StoreContextProvider`;

```tsx
import create from "reducer-context-hook";

type State = { count: number };

type Action = { type: "reset" | "increment" | "decrement" };

export const { StoreContextProvider, useDispatch, useMappedState } = create<
  State,
  Action
>();
```

### StoreContextProvider

Please wrap your App with `StoreContextProvider` and pass reducer and initial state as props.

```tsx
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
    default:
      throw new Error();
  }
}

const initialState: State = {
  count: 0
};

function App() {
  return (
    <StoreContextProvider reducer={reducer} initialState={initialState}>
      <App />
    </StoreContextProvider>
  );
}
```

### useDispatch

Get `dispatch`.

```tsx
function Increment() {
  const dispatch = useDispatch();
  const increment = React.useCallback(
    () => dispatch({ type: "increment" }),
    []
  );
  return <button onClick={increment}>+</button>;
}
```

### useMappedState

Get state from the store with mapState function.

```tsx
function Counter() {
  const { count } = useMappedState(
    state => ({
      count: state.count
    }),
    []
  );
  return <p>{count}</p>;
}
```

## Licence

MIT
