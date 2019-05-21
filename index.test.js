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

const requiredNumberDefaultValue = `
import { h, Component, Prop } from '@stencil/core';

@Component({ tag: 'my-component' })
export class ManifoldSelect {
  @Prop() answer: number = 42;

  render() {
    return null;
  }
}`;

const optionalNumber = `
import { h, Component, Prop } from '@stencil/core';

@Component({ tag: 'my-component' })
export class ManifoldSelect {
  @Prop() answer?: number;

  render() {
    return null;
  }
}`;

const requiredNumberWithoutDefault = `
import { h, Component, Prop } from '@stencil/core';

@Component({ tag: 'my-component' })
export class ManifoldSelect {
  @Prop() answer: number;

  render() {
    return null;
  }
}`;

ruleTester.run(
  "restrict-required-props",
  plugin.rules["restrict-required-props"],
  {
    valid: [
      {
        code: requiredNumberDefaultValue
      },
      {
        code: optionalNumber
      }
    ],
    invalid: [
      {
        code: requiredNumberWithoutDefault,
        errors: [{ messageId: "attributesOnly" }]
      }
    ]
  }
);
