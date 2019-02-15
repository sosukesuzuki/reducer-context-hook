import { useReducer, createContext, useContext, useCallback } from "react";

export default function create<State = any, Action = any>(
  reducer: React.Reducer<State, Action>,
  initialState: State
) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const StoreContext = createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
  }>({ state, dispatch });

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

  return {
    StoreContext,
    useMappedState,
    useDispatch
  };
}
