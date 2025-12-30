module.exports = {
  extends: ['standard-with-typescript', 'prettier'],
  ignorePatterns: ['node_modules', 'dist', 'build', 'cache', 'artifacts', 'types'],
  rules: {
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn'
  },
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname, // now __dirname works correctly
    sourceType: 'module'
  }
};
