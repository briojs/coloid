import brioJSConfig from 'eslint-config-briojs';

export default brioJSConfig({
  rules: {
    'unicorn/no-nested-ternary': 'off',
    'unicorn/import-style': 'off',
  },
});
