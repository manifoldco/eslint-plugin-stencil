# eslint-plugin-stencil

ESLint rules to enforce better practices in Stencil development

[Code of Conduct](./CODE_OF_CONDUCT.md) |
[Contribution Guidelines](./.github/CONTRIBUTING.md)

[![GitHub release](https://img.shields.io/github/tag/manifoldco/eslint-plugin-stencil.svg?label=latest)](https://github.com/manifoldco/eslint-plugin-stencil/releases)

[![Travis](https://img.shields.io/travis/manifoldco/eslint-plugin-stencil/master.svg)](https://travis-ci.org/manifoldco/eslint-plugin-stencil)

[![License](https://img.shields.io/badge/license-BSD-blue.svg)](./LICENSE.md)

## Install

Download to your dev dependencies from npm.

```
npm i -D @manifoldco/eslint-plugin-stencil
```

## Integrating the Plugin

First, add to the `plugins` array of your ESLint configuration.

```json
// .eslintrc.js
module.exports = {
  plugins: ['@manifoldco/stencil'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true,
      jsx: true,
    },
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
```

If you're not already linting your Stencil project, you'll want to use [@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser) with the parser options and settings shown above.

## Configuring Rules

This plugin comes with two rules, which need to be added and configured individually within your ESLint configuration. Explanation of these rules, including their reasoning and integration instructions, is listed below.

### restrict-required-props

This rule limits which component props can be required. Stencil components can accept props of all types, but when using web components from HTML, only legal HTML attributes can be added as props. In order to add object, array, or numeric props to a web component, you need to access your element from JavaScript. For this reason, this rule will ensure that any component prop that isn't a legal HTML attribute type must either be optional or declare a default value.

To turn this rule on for your project, add it to the `rules` field in your ESLint configuration:

```json
// .eslintrc.js
  rules: {
    '@manifoldco/stencil/restrict-required-props': 'error',
```

### stencil-component-prefix

This rule exists to enforce a consistent naming convention for all your web components. This will help your consumers avoid naming collisions when using more than one web component library.

To turn this rule on for your project, add it to the `rules` field in your ESLint configuration, and specify a prefix. For example, if you want all of your web components to be prefixed with `scalawags-`:

```json
// .eslintrc.js
  rules: {
    '@manifoldco/stencil/stencil-component-prefix': ['error', { prefix: 'scalawags-' }],
```
