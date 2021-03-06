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

```js
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

```js
// .eslintrc.js
  rules: {
    '@manifoldco/stencil/restrict-required-props': 'error',
```

### component-prefix

This rule exists to enforce a consistent naming convention for all your web components. This will help your consumers avoid naming collisions when using more than one web component library.

To turn this rule on for your project, add it to the `rules` field in your ESLint configuration, and specify a prefix. For example, if you want all of your web components to be prefixed with `scalawags-`:

```js
// .eslintrc.js
  rules: {
    '@manifoldco/stencil/component-prefix': ['error', { prefix: 'scalawags-' }],
```

### require-render-decorator

This rule requires all Stencil components to decorate their render methods with a given decorator. This allows you to simulate something React's error boundaries. For instance, your decorator can wrap the render method in a try/catch, where the catch block can send errors to a logging service and display an error message to the user.

To turn this rule on for your project, add it to the `rules` field in your ESLint configuration. By default, the decorator name will be `logger`, but you can override this in the options array:

```js
// .eslintrc.js
  rules: {
    '@manifoldco/stencil/require-render-decorator': ['error', { decaratorName: 'renAndStimpyLoveLogs' }],
```

### require-componentWillLoad-decorator

This rule requires all Stencil components to decorate their `componentWillLoad` methods with a given decorator. One possible use for this is to set a performance mark at load time for your component.

To turn this rule on for your project, add it to the `rules` field in your ESLint configuration. By default, the decorator name will be `loadMark`, but you can override this in the options array:

```js
// .eslintrc.js
  rules: {
    '@manifoldco/stencil/require-componentWillLoad-decorator': ['error', { decaratorName: 'loadMark' }],
```

### require-componentWillLoad

This rule requires all Stencil components to declare a componentWillLoad method. This is useful when combined with the above rule to ensure that all components are decorated with the above decorator.

To turn this rule on for your project, add it to the `rules` field in your ESLint configuration.

```js
// .eslintrc.js
  rules: {
    '@manifoldco/stencil/require-componentWillLoad': ['error', {}],
```
