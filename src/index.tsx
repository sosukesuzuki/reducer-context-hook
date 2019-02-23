import * as React from "react";

type ActionCreator<A> = {
  (...args: any[]): A;
};

type ActionCreatorsMapObject<A> = {
  [key: string]: ActionCreator<A>;
};

type DispatchMap<T> = { [key in keyof T]: (...args: any[]) => void };

export default function create<State = any, Action = any>() {
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

  function useMappedDispatch<T extends ActionCreatorsMapObject<Action>>(
    actions: T,
    memoizationArray: ReadonlyArray<any>
  ): DispatchMap<T> {
    const { dispatch } = React.useContext(StoreContext);
    return React.useMemo(() => {
      const dispatchMap: { [key: string]: Function } = {};
      for (const key in actions) {
        const actionCreator = actions[key];
        dispatchMap[key] = (...args: any[]) => dispatch(actionCreator(...args));
      }
      return dispatchMap as DispatchMap<T>;
    }, memoizationArray);
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
    useDispatch,
    useMappedDispatch
  };
}
