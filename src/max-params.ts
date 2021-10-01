/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */

const astUtils = require('eslint/lib/rules/utils/ast-utils');
const { upperCaseFirst } = require('eslint/lib/shared/string-utils');

const TARGET_METHODS = /^(every|filter|find|flatMap|forEach|map|reduce|some|sort)$/;

const isTargetMethod = (node: any) => {
    const checkNode = astUtils.skipChainExpression(node);

    if (checkNode.type !== 'MemberExpression') {
        return false;
    }

    if (!astUtils.isSpecificId(checkNode.property, TARGET_METHODS)) {
        return false;
    }

    return true;
};

const getArrayMethodName = (node: any) => {
    let currentNode = node;

    while (currentNode) {
        const parent = currentNode.parent;

        switch (parent.type) {
            case 'LogicalExpression':
            case 'ConditionalExpression':
            case 'ChainExpression':
                currentNode = parent;
                break;
            case 'ReturnStatement': {
                const func = astUtils.getUpperFunction(parent);

                if (func === undefined || !astUtils.isCallee(func)) {
                    return undefined;
                }
                currentNode = func.parent;
                break;
            }
            case 'CallExpression':
                if (astUtils.isArrayFromMethod(parent.callee)) {
                    if (parent.arguments.length >= 2 && parent.arguments[1] === currentNode) {
                        return 'from';
                    }
                }
                if (isTargetMethod(parent.callee)) {
                    if (parent.arguments.length >= 1 && parent.arguments[0] === currentNode) {
                        return astUtils.getStaticPropertyName(parent.callee);
                    }
                }
                console.log('isTargetMethod: ', false);
                return undefined;
            default:
                return undefined;
        }
    }
    return undefined;
};

module.exports = {
    meta: {
        type: 'suggestion',

        docs: {
            description: 'enforce a maximum number of parameters in function definitions except arrays calls',
            recommended: false,
        },

        schema: [
            {
                oneOf: [
                    {
                        type: 'integer',
                        minimum: 0,
                    },
                    {
                        type: 'object',
                        properties: {
                            max: {
                                type: 'integer',
                                minimum: 0,
                            },
                            allowArraysCallbacks: {
                                type: 'boolean',
                            },
                        },
                        additionalProperties: false,
                    },
                ],
            },
        ],
        messages: {
            exceed: '{{name}} has too many parameters ({{count}}). Maximum allowed is {{max}}.',
        },
    },

    create(context: any) {
        const sourceCode = context.getSourceCode();
        const option = context.options[0];
        let numParams = 3;
        let allowArraysCallbacks = false;

        if (typeof option === 'object') {
            if (
                Object.prototype.hasOwnProperty.call(option, 'maximum') ||
                Object.prototype.hasOwnProperty.call(option, 'max')
            ) {
                numParams = option.maximum || option.max;
            }
            if (Object.prototype.hasOwnProperty.call(option, 'allowArraysCallbacks')) {
                allowArraysCallbacks = option.allowArraysCallbacks;
            }
        }
        if (typeof option === 'number') {
            numParams = option;
        }

        function checkFunction(node: any) {
            if (
                node.params.length > numParams &&
                (allowArraysCallbacks == false || getArrayMethodName(node) == undefined)
            ) {
                context.report({
                    loc: astUtils.getFunctionHeadLoc(node, sourceCode),
                    node,
                    messageId: 'exceed',
                    data: {
                        name: upperCaseFirst(astUtils.getFunctionNameWithKind(node)),
                        count: node.params.length,
                        max: numParams,
                    },
                });
            }
        }

        return {
            FunctionDeclaration: checkFunction,
            ArrowFunctionExpression: checkFunction,
            FunctionExpression: checkFunction,
        };
    },
};
