import * as React from "react";

let globalState: any = {};

type Options = { logging: boolean };

export default function create<State = any, Action = any>(
  options: Options = { logging: false }
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

  function useReducer(
    reducer: React.Reducer<State, Action>,
    initialState: State
  ) {
    const result = React.useReducer(reducer, initialState);
    globalState = result[0];
    return result;
  }

  function log(
    dispatch: React.Dispatch<Action>,
    action: Action,
    reducer: React.Reducer<State, Action>
  ): React.Dispatch<Action> {
    const beforeState = globalState;
    const afterState = reducer(globalState, action);
    console.log("before state", beforeState);
    console.log("action", action);
    console.log("after state", afterState);
    return dispatch;
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
    const [state, dispatch] = useReducer(reducer, initialState);

    const enhancedDispatch: React.Dispatch<Action> = function(value) {
      let finalDispatch: React.Dispatch<Action> = dispatch;
      if (options.logging) finalDispatch = log(dispatch, value, reducer);
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
