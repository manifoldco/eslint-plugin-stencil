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

const goodPrefix = `
import { h, Component, Prop } from '@stencil/core';

@Component({ tag: 'manifold-component' })
export class ManifoldSelect {
  @Prop() answer: number = 42;

  render() {
    return null;
  }
}`;

const customPrefix = `
import { h, Component, Prop } from '@stencil/core';

@Component({ tag: 'quux-component' })
export class ManifoldSelect {
  @Prop() answer: number = 42;

  render() {
    return null;
  }
}`;

const badPrefix = `
import { h, Component, Prop } from '@stencil/core';

@Component({ tag: 'quux-component' })
export class ManifoldSelect {
  @Prop() answer: number = 42;

  render() {
    return null;
  }
}`;

ruleTester.run("component-prefix", plugin.rules["component-prefix"], {
  valid: [
    {
      code: goodPrefix
    },
    {
      code: customPrefix,
      options: [{ prefix: "quux-" }]
    }
  ],
  invalid: [
    {
      code: badPrefix,
      options: [{ prefix: "baz-" }],
      errors: [
        {
          messageId: "badPrefix"
        }
      ]
    }
  ]
});

const isNotAComponent = `
export class ManifoldSelect {
  @Prop() answer: number;

  render() {
    return null;
  }
}`;

const componentMissingLogger = `
import { h, Component, Prop } from '@stencil/core';

@Component({ tag: 'quux-component' })
export class ManifoldSelect {
  @Prop() answer: number = 42;

  render() {
    return null;
  }
}`;

const componentWithLogger = `
import { h, Component, Prop } from '@stencil/core';

@Component({ tag: 'quux-component' })
export class ManifoldSelect {
  @Prop() answer: number = 42;

  @logger()
  render() {
    return null;
  }
}`;

ruleTester.run("require-logger", plugin.rules["require-logger"], {
  valid: [
    {
      code: isNotAComponent
    },
    {
      code: componentWithLogger
    }
  ],
  invalid: [
    {
      code: componentMissingLogger,
      errors: [{ messageId: "loggerMissing" }]
    }
  ]
});
