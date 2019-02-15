import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import create from "../src/index";

type Action = { type: "inc" };
type State = { count: number };
const reducer = (state: State, { type }: Action): State =>
  type === "inc" ? { count: state.count + 1 } : { ...state };

const { StoreContextProvider, useMappedState } = create<State, Action>();

describe("reducer-context-hook", () => {
  let reactRoot: HTMLDivElement;
  beforeEach(() => {
    reactRoot = document.createElement("div");
    document.body.appendChild(reactRoot);
  });

  afterEach(() => {
    document.body.removeChild(reactRoot);
  });

  function render(element: React.ReactElement<any>) {
    act(() => {
      ReactDOM.render(
        <StoreContextProvider reducer={reducer} initialState={{ count: 0 }}>
          {element}
        </StoreContextProvider>,
        reactRoot
      );
    });
  }

  function getText() {
    return reactRoot.textContent;
  }

  describe("useMappedState", () => {
    it("returns state", () => {
      function Component() {
        const count = useMappedState(state => state.count, []);
        return <p>{count}</p>;
      }
      render(<Component />);
      expect(getText()).toBe("0");
    });
  });
});
