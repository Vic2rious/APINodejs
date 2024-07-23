import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
    },
  },
  pluginJs.configs.recommended,
  {
    rules: {
      "eqeqeq": "error",          // Enforce the use of === and !==
      "no-var": "error",          // Disallow the use of var
      "prefer-const": "error",    // Prefer const over let for variables that are never reassigned
      "no-unused-vars": "warn",   // Disallow unused variables
      "quotes": ["error", "double"], // Enforce the use of double quotes
    },
  },
];
