/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */

const astUtils = require('eslint/lib/rules/utils/ast-utils');

import { isTargetMethod } from './method-utils';

const getCallExpressionMethodName = (currentNode: any) => {
    const parent = currentNode.parent;
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
    return undefined;
};

const getArrayMethodName = (node: any): string | undefined => {
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
                return getCallExpressionMethodName(currentNode);
            default:
                return undefined;
        }
    }
    return undefined;
};

export { getArrayMethodName };
