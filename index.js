module.exports.rules = {
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
  "stencil-component-prefix": {
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
