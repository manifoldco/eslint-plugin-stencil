const RuleTester = require("eslint").RuleTester;
const plugin = require("./index");

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      legacyDecorators: true,
      jsx: true
    }
  },
  parser: "@typescript-eslint/parser"
});

const validProps = `
import { h, Component, Prop } from '@stencil/core';

@Component({ tag: 'my-component' })
export class ManifoldSelect {
  @Prop() answer?: number = 42;

  render() {
    return null;
  }
}
`;

ruleTester.run(
  "restrict-required-props",
  plugin.rules["restrict-required-props"],
  {
    valid: [
      {
        code: validProps
      }
    ],
    invalid: []
  }
);
