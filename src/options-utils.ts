const getNumParams = (contextOptions: number | { max: number }): number => {
    if (typeof contextOptions === 'object' && Object.prototype.hasOwnProperty.call(contextOptions, 'max')) {
        return contextOptions.max;
    } else if (typeof contextOptions === 'number') {
        return contextOptions;
    }

    return 3;
};

const getAllowArraysCallbacks = (contextOptions: number | { allowArraysCallbacks: boolean }): boolean => {
    if (
        typeof contextOptions === 'object' &&
        Object.prototype.hasOwnProperty.call(contextOptions, 'allowArraysCallbacks')
    ) {
        return contextOptions.allowArraysCallbacks;
    }

    return false;
};

export { getNumParams, getAllowArraysCallbacks };
