import cloneDeep = require('lodash/cloneDeep');
import isEmpty = require('lodash/isEmpty');

import {
    IAfm,
    IFilter,
    INegativeAttributeFilter,
    IPositiveAttributeFilter
} from '../interfaces/Afm';

export function isNotEmptyFilter(filter: IFilter): boolean {
    return (filter.type === 'date') ||
        (
            !isEmpty((filter as IPositiveAttributeFilter).in) ||
            !isEmpty((filter as INegativeAttributeFilter).notIn)
        );
}

export function mergeFilters(afm: IAfm, filters: IFilter[]): IAfm {
    const cloned = cloneDeep(afm);

    return {
        ...cloned,
        filters: [...(cloned.filters || []), ...filters]
            .filter(isNotEmptyFilter)
    };
}
