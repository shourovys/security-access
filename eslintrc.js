module.exports = {
  extends: ['standard', 'eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:import/recommended', 'plugin:jsx-a11y/recommended', 'plugin:@typescript-eslint/recommended', 'eslint-config-prettier', 'plugin:react/recommended', 'plugin:react/jsx-runtime', 'prettier'],
  plugins: ['react', '@typescript-eslint'],
  env: {
    browser: true, es6: true, jest: true,
  },
  globals: {
    Atomics: 'readonly', SharedArrayBuffer: 'readonly',
  },
  parser: {
    ecmaVersion: 'latest', sourceType: 'module',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    }, ecmaVersion: 2018, sourceType: 'module', project: './tsconfig.json',
  },
  settings: {
    react: {
      version: 'detect', // Automatically includes the React version
    },
  },
  rules: {
    'linebreak-style': 'off', 'react-hooks/exhaustive-deps': 'off', 'prettier/prettier': ['error', {
      endOfLine: 'auto',
    }],
  },
}
