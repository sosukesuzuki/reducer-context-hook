import React, { useReducer, createContext, useContext, useCallback } from "react";

export default function create<State = any, Action = any>(
  reducer: React.Reducer<State, Action>,
  initialState: State
) {
  const StoreContext = createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
  }>({ state: (null as any), dispatch: (null as any) });

  function useMappedState<Result>(
    mapState: (state: State) => Result,
    memoizationArray: ReadonlyArray<any>
  ): Result {
    const { state } = useContext(StoreContext);
    const memoizedMapState = useCallback(mapState, memoizationArray);
    return memoizedMapState(state);
  }

  function useDispatch(): React.Dispatch<Action> {
    const { dispatch } = useContext(StoreContext);
    return dispatch;
  }

  function StoreContextProvider({ children }: { children: React.ReactElement}) {
    const [, dispatch] = useReducer(reducer, initialState);
    return (
      <StoreContext.Provider value={{state: initialState, dispatch}}>
        {children}
      </StoreContext.Provider>
    )
  }

  return {
    StoreContextProvider,
    useMappedState,
    useDispatch
  };
}
