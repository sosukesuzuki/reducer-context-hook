import * as React from "react";

export default function create<State = any, Action = any>(
  reducer: React.Reducer<State, Action>,
  initialState: State
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

  function StoreContextProvider({
    children
  }: {
    children: React.ReactElement;
  }) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return (
      <StoreContext.Provider value={{ state, dispatch }}>
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
