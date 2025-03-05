// import globals from "globals";
// import pluginJs from "@eslint/js";


// /** @type {import('eslint').Linter.Config[]} */
// export default [
//   {languageOptions: { globals: globals.browser }},
//   pluginJs.configs.recommended,
// ];

export default {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:node/recommended',
    'plugin:promise/recommended',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'warn',
    'import/no-unresolved': 'error',
    'node/no-missing-import': 'off',
  },
};
