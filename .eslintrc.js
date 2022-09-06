module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'unused-imports',
    'prettier',
    'jest',
    'react-hooks',
    'react',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'no-console': 'error',
    "@typescript-eslint/consistent-type-imports": "error"
  },
  ignorePatterns: ['**/*.js'],
};
