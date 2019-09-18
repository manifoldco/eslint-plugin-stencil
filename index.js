module.exports.rules = {
  "require-render-decorator": {
    meta: {
      messages: {
        decoratorMissing:
          "Each component's render method must be decorated with the @{{ decoratorName }} decorator."
      },
      schema: [
        {
          type: "object",
          properties: {
            decoratorName: {
              type: "string"
            }
          }
        }
      ]
    },
    create: context => ({
      MethodDefinition(node) {
        const ancestors = context.getAncestors();
        const isComponent = ancestors.some(a => {
          const isClass =
            a.type === "ExportNamedDeclaration" &&
            a.declaration.type === "ClassDeclaration";

          if (isClass) {
            const decorators = a.declaration.decorators || [];
            return decorators.some(
              d => d.expression.callee.name === "Component"
            );
          }

          return false;
        });

        if (isComponent && node.key.name === "render") {
          const decorators = node.decorators || [];
          const option = context.options[0] || {
            decoratorName: "logger"
          };
          const logger = decorators.find(
            d => d.expression.callee.name === option.decoratorName
          );

          if (!logger) {
            context.report({
              node,
              messageId: "decoratorMissing",
              data: {
                decoratorName: option.decoratorName
              }
            });
          }
        }
      }
    })
  },
  "require-componentWillLoad-decorator": {
    meta: {
      messages: {
        decoratorMissing:
          "Each component's componentWillLoad method must be decorated with the @{{ decoratorName }} decorator."
      },
      schema: [
        {
          type: "object",
          properties: {
            decoratorName: {
              type: "string"
            }
          }
        }
      ]
    },
    create: context => ({
      MethodDefinition(node) {
        const ancestors = context.getAncestors();
        const isComponent = ancestors.some(a => {
          const isClass =
            a.type === "ExportNamedDeclaration" &&
            a.declaration.type === "ClassDeclaration";

          if (isClass) {
            const decorators = a.declaration.decorators || [];
            return decorators.some(
              d => d.expression.callee.name === "Component"
            );
          }

          return false;
        });

        if (isComponent && node.key.name === "componentWillLoad") {
          const decorators = node.decorators || [];
          const option = context.options[0] || {
            decoratorName: "loadMark"
          };
          const loadMark = decorators.find(
            d => d.expression.callee.name === option.decoratorName
          );

          if (!loadMark) {
            context.report({
              node,
              messageId: "decoratorMissing",
              data: {
                decoratorName: option.decoratorName
              }
            });
          }
        }
      }
    })
  },
  "require-componentWillLoad": {
    meta: {
      messages: {
        componentWillLoadMissing:
          "Each component must include a componentWillLoad method."
      },
      schema: []
    },
    create: context => ({
      ClassDeclaration(node) {
        const isComponent = !!(
          node.decorators &&
          node.decorators.some(d => d.expression.callee.name === "Component")
        );

        const hasComponentWillLoad = node.body.body.some(
          d =>
            d.type === "MethodDefinition" && d.key.name === "componentWillLoad"
        );

        if (isComponent && !hasComponentWillLoad){
          context.report({
            node,
            messageId: "componentWillLoadMissing",
          });
        }
      }
    })
  },
  "restrict-required-props": {
    meta: {
      messages: {
        attributesOnly:
          "The property {{ name }} must either be optional or have a default value assigned. Only properties that can be set from HTML attributes should be required unless default values are provide (only booleans and strings can be set via attributes)."
      },
      schema: []
    },
    create: context => ({
      ClassProperty(node) {
        const decorators = node.decorators || [];
        const prop = decorators.find(d => d.expression.callee.name === "Prop");

        if (prop) {
          const allowedTypes = ["TSBooleanKeyword", "TSStringKeyword"];
          if (
            !node.optional &&
            !node.value &&
            !allowedTypes.includes(node.typeAnnotation.typeAnnotation.type)
          ) {
            context.report({
              node,
              messageId: "attributesOnly",
              data: {
                name: node.key.name
              }
            });
          }
        }
      }
    })
  },
  "component-prefix": {
    meta: {
      messages: {
        badPrefix: "Component {{ name }} should be prefixed with '{{ prefix }}'"
      },
      schema: [
        {
          type: "object",
          properties: {
            prefix: {
              type: "string"
            }
          }
        }
      ]
    },
    create: context => ({
      ExportNamedDeclaration(node) {
        if (node.declaration.type === "ClassDeclaration") {
          const decorators = node.declaration.decorators || [];
          const component = decorators.find(
            d => d.expression.callee.name === "Component"
          );
          if (component) {
            const tag = component.expression.arguments[0].properties.find(
              p => p.key.name === "tag"
            );

            if (tag) {
              const name = tag.value.value;
              const prefixOption = context.options[0] || {
                prefix: "manifold-"
              };
              const prefix = prefixOption.prefix;
              if (!name.startsWith(prefix)) {
                context.report({
                  node,
                  messageId: "badPrefix",
                  data: {
                    name,
                    prefix
                  }
                });
              }
            }
          }
        }
      }
    })
  }
};
