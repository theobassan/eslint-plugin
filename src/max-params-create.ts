/* eslint-disable @typescript-eslint/no-var-requires */
const astUtils = require('eslint/lib/rules/utils/ast-utils');
const { upperCaseFirst } = require('eslint/lib/shared/string-utils');

import { Rule } from 'eslint';
import { getArrayMethodName } from './array-utils';
import { getNumParams, getAllowArraysCallbacks } from './options-utils';
import { Node } from './types';

const checkFunction = (options: { context: Rule.RuleContext; node: Node }): void => {
    const contextOptions = options.context.options[0];
    const numParams = getNumParams(contextOptions);
    const allowArraysCallbacks = getAllowArraysCallbacks(contextOptions);

    if (
        options.node.params.length > numParams &&
        (allowArraysCallbacks == false || getArrayMethodName(options.node) == undefined)
    ) {
        options.context.report({
            loc: astUtils.getFunctionHeadLoc(options.node, options.context.getSourceCode()),
            node: options.node,
            messageId: 'exceed',
            data: {
                name: upperCaseFirst(astUtils.getFunctionNameWithKind(options.node)),
                count: options.node.params.length.toString(),
                max: numParams.toString(),
            },
        });
    }
};

const create = (context: Rule.RuleContext): Rule.RuleListener => {
    return {
        FunctionDeclaration: (node: Rule.Node) => checkFunction({ context, node: node as Node }),
        ArrowFunctionExpression: (node: Rule.Node) => checkFunction({ context, node: node as Node }),
        FunctionExpression: (node: Rule.Node) => checkFunction({ context, node: node as Node }),
    };
};

export { create };
