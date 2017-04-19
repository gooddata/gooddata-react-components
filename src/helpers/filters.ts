import { cloneDeep, isEmpty } from 'lodash';
import { IAfm, IFilter } from '../interfaces/Afm';

export function isNotEmptyFilter(filter: any): boolean {
    return (filter.type === 'date') ||
        (!isEmpty(filter.in) || !isEmpty(filter.notIn));
}

export function mergeFilters(afm: IAfm, filters: IFilter[]): IAfm {
    const cloned = cloneDeep(afm);

    return {
        ...cloned,
        filters: [...(cloned.filters || []), ...filters]
            .filter(isNotEmptyFilter)
    };
}
