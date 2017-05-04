import cloneDeep = require('lodash/cloneDeep');
import isEmpty = require('lodash/isEmpty');

import { IAfm, IFilter, IAttributeFilter } from '../interfaces/Afm';

export function isNotEmptyFilter(filter: IFilter): boolean {
    return (filter.type === 'date') ||
        (
            !isEmpty((filter as IAttributeFilter).in) ||
            !isEmpty((filter as IAttributeFilter).notIn)
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
