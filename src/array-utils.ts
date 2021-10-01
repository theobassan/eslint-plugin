/* eslint-disable @typescript-eslint/no-var-requires */
const astUtils = require('eslint/lib/rules/utils/ast-utils');

import { isTargetMethod } from './method-utils';
import { Node } from './types';

const getCallExpressionMethodName = (currentNode: Node) => {
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

const getArrayMethodName = (node: Node): string | undefined => {
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
                return getCallExpressionMethodName(currentNode as Node);
            default:
                return undefined;
        }
    }
    return undefined;
};

export { getArrayMethodName };
