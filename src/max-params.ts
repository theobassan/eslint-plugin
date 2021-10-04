import { Rule } from 'eslint';

import { create } from './max-params-create';

module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'enforce a maximum number of parameters in function definitions',
            recommended: false,
        },
        schema: [
            {
                oneOf: [
                    {
                        type: 'integer',
                        minimum: 1,
                    },
                    {
                        type: 'object',
                        properties: {
                            max: {
                                type: 'integer',
                                minimum: 1,
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
    create(context: Rule.RuleContext) {
        return create(context);
    },
};
