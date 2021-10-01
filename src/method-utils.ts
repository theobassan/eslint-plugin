/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */

const astUtils = require('eslint/lib/rules/utils/ast-utils');

const TARGET_METHODS = /^(every|filter|find|flatMap|forEach|map|reduce|some|sort)$/;

const isTargetMethod = (node: any): boolean => {
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
