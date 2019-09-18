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

let componentWithOtherDecorator = `
import { h, Component, Prop } from '@stencil/core';

@Component({ tag: 'quux-component' })
export class ManifoldSelect {
  @Prop() answer: number = 42;

  @quux()
  render() {
    return null;
  }
}`;

ruleTester.run(
  "require-render-decorator",
  plugin.rules["require-render-decorator"],
  {
    valid: [
      {
        code: isNotAComponent
      },
      {
        code: componentWithLogger
      },
      {
        code: componentWithOtherDecorator,
        options: [{ decoratorName: "quux" }]
      }
    ],
    invalid: [
      {
        code: componentMissingLogger,
        errors: [{ messageId: "decoratorMissing" }]
      }
    ]
  }
);

const componentMissingLoadMark = `
import { h, Component, Prop } from '@stencil/core';

@Component({ tag: 'quux-component' })
export class ManifoldSelect {
  @Prop() answer: number = 42;

  componentWillLoad() {}
}`;

const componentWithLoadMark = `
import { h, Component, Prop } from '@stencil/core';

@Component({ tag: 'quux-component' })
export class ManifoldSelect {
  @Prop() answer: number = 42;

  @loadMark()
  componentWillLoad() {}
}`;

const componentWithOtherComponentWillLoadDecorator = `
import { h, Component, Prop } from '@stencil/core';

@Component({ tag: 'quux-component' })
export class ManifoldSelect {
  @Prop() answer: number = 42;

  @quux()
  componentWillLoad() {}
}`;

ruleTester.run(
  "require-componentWillLoad-decorator",
  plugin.rules["require-componentWillLoad-decorator"],
  {
    valid: [
      {
        code: isNotAComponent
      },
      {
        code: componentWithLoadMark
      },
      {
        code: componentWithOtherComponentWillLoadDecorator,
        options: [{ decoratorName: "quux" }],
      }
    ],
    invalid: [
      {
        code: componentMissingLoadMark,
        errors: [{ messageId: "decoratorMissing" }]
      }
    ]
  }
);

const componentWithComponentWillLoad = `
import { h, Component, Prop } from '@stencil/core';

@Component({ tag: 'quux-component' })
export class ManifoldSelect {
  @Prop() answer: number = 42;

  componentWillLoad() {}
}`;

const componentMissingComponentWillLoad = `
import { h, Component, Prop } from '@stencil/core';

@Component({ tag: 'quux-component' })
export class ManifoldSelect {
  @Prop() answer: number = 42;
}`;

ruleTester.run(
  "require-componentWillLoad",
  plugin.rules["require-componentWillLoad"],
  {
    valid: [
      {
        code: isNotAComponent
      },
      {
        code: componentWithComponentWillLoad
      }
    ],
    invalid: [
      {
        code: componentMissingComponentWillLoad,
        errors: [{ messageId: "componentWillLoadMissing" }]
      }
    ]
  }
);
