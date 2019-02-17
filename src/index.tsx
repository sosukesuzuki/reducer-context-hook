import * as React from "react";

let globalState: any = {};

type Middleware<S, A> = (
  state: S,
  dispatch: React.Dispatch<A>,
  action: A,
  reducer: React.Reducer<S, A>
) => React.Dispatch<A>;

function combineMiddlewares<S, A>(
  middlewares: Middleware<S, A>[],
  state: S,
  dispatch: React.Dispatch<A>,
  action: A,
  reducer: React.Reducer<S, A>
): React.Dispatch<A> {
  const [head, ...tail] = middlewares;
  const newDispatch = head(state, dispatch, action, reducer);
  if (tail.length === 0) return newDispatch;
  return combineMiddlewares(tail, state, newDispatch, action, reducer);
}

export default function create<State = any, Action = any>(
  middlewares?: Middleware<State, Action>[]
) {
  const StoreContext = React.createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
  }>({ state: null as any, dispatch: null as any });

  function useMappedState<Result>(
    mapState: (state: State) => Result,
    memoizationArray: ReadonlyArray<any>
  ): Result {
    const { state } = React.useContext(StoreContext);
    const memoizedMapState = React.useCallback(mapState, memoizationArray);
    return memoizedMapState(state);
  }

  function useDispatch(): React.Dispatch<Action> {
    const { dispatch } = React.useContext(StoreContext);
    return dispatch;
  }

  function useReducerWithSaveState(
    reducer: React.Reducer<State, Action>,
    initialState: State
  ) {
    const result = React.useReducer(reducer, initialState);
    globalState = result[0];
    return result;
  }

  function StoreContextProvider({
    reducer,
    initialState,
    children
  }: {
    reducer: React.Reducer<State, Action>;
    initialState: State;
    children: React.ReactElement;
  }) {
    const [state, dispatch] = useReducerWithSaveState(reducer, initialState);

    const enhancedDispatch: React.Dispatch<Action> = function(value) {
      let finalDispatch: React.Dispatch<Action> = dispatch;
      if (middlewares && middlewares.length !== 0) {
        finalDispatch = combineMiddlewares(
          middlewares,
          globalState,
          dispatch,
          value,
          reducer
        );
      }
      finalDispatch(value);
    };

    return (
      <StoreContext.Provider value={{ state, dispatch: enhancedDispatch }}>
        {children}
      </StoreContext.Provider>
    );
  }

  return {
    StoreContextProvider,
    useMappedState,
    useDispatch
  };
}
