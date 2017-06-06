import cloneDeep = require('lodash/cloneDeep');
import isEmpty = require('lodash/isEmpty');
import * as Afm from '../interfaces/Afm';

export function isNotEmptyFilter(filter: Afm.IFilter): boolean {
    return (filter.type === 'date') ||
        (
            !isEmpty((filter as Afm.IPositiveAttributeFilter).in) ||
            !isEmpty((filter as Afm.INegativeAttributeFilter).notIn)
        );
}

export function mergeFilters(afm: Afm.IAfm, filters: Afm.IFilter[]): Afm.IAfm {
    const cloned = cloneDeep(afm);

    return {
        ...cloned,
        filters: [...(cloned.filters || []), ...filters]
            .filter(isNotEmptyFilter)
    };
}
