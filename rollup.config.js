import typescript from "rollup-plugin-typescript";
import resolve from "rollup-plugin-node-resolve";
import url from "rollup-plugin-url";
import copy from "rollup-plugin-cpy";
import external from "rollup-plugin-peer-deps-external";

import pkg from "./package.json";

export default {
  input: "src/index.tsx",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "es",
      exports: "named",
      sourcemap: true,
    },
  ],
  plugins: [
    typescript(),
    resolve(),
    url(),
    external(),
    copy([
      {
        files: ["src/index.tsx"],
        dest: 'example/src/reducer-context-hook'
      }
    ])
  ]
}