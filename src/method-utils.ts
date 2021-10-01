/* eslint-disable @typescript-eslint/no-var-requires */
const astUtils = require('eslint/lib/rules/utils/ast-utils');

import { Node } from './types';

const TARGET_METHODS = /^(every|filter|find|flatMap|forEach|map|reduce|some|sort)$/;

const isTargetMethod = (node: Node): boolean => {
    const checkNode = astUtils.skipChainExpression(node);

    if (checkNode.type !== 'MemberExpression') {
        return false;
    }

    if (!astUtils.isSpecificId(checkNode.property, TARGET_METHODS)) {
        return false;
    }

    return true;
};

export { isTargetMethod };
