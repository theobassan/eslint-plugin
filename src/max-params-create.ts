/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */

const astUtils = require('eslint/lib/rules/utils/ast-utils');
const { upperCaseFirst } = require('eslint/lib/shared/string-utils');

import { getArrayMethodName } from './array-utils';

const checkFunction = (options: { node: any; context: any }) => {
    const option = options.context.options[0];
    const numParams = getNumParams(option);
    const allowArraysCallbacks = getAllowArraysCallbacks(option);

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
                count: options.node.params.length,
                max: numParams,
            },
        });
    }
};

const getNumParams = (option: number | { max: number }): number => {
    if (typeof option === 'object' && Object.prototype.hasOwnProperty.call(option, 'max')) {
        return option.max;
    } else if (typeof option === 'number') {
        return option;
    }

    return 3;
};

const getAllowArraysCallbacks = (option: number | { allowArraysCallbacks: boolean }): boolean => {
    if (typeof option === 'object' && Object.prototype.hasOwnProperty.call(option, 'allowArraysCallbacks')) {
        return option.allowArraysCallbacks;
    }

    return false;
};

const create = (context: any): any => {
    return {
        FunctionDeclaration: (node: any) => checkFunction({ context, node }),
        ArrowFunctionExpression: (node: any) => checkFunction({ context, node }),
        FunctionExpression: (node: any) => checkFunction({ context, node }),
    };
};

export { create };
