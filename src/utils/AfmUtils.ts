import { compact } from 'lodash';
import { IAfm, IDateFilter, IFilter, IAttributeFilter } from '../interfaces/Afm';

/**
 * Append attribute filters and date filter to afm
 * Date filter handling:
 * * Override if date filter has the same id
 * * Add if date filter if date filter id is different
 * Attribute filter handling:
 * * Add all
 */
export const appendFilters = (afm: IAfm, attributeFilters: IAttributeFilter[], dateFilter: IDateFilter): IAfm => {
    const dateFilters = (dateFilter && dateFilter.granularity) ? [dateFilter] : [];
    const afmDateFilter = afm.filters && afm.filters.find(filter => filter.type === 'date') as IDateFilter;

    // all-time selected, need to delete date filter from filters
    let afmFilters = afm.filters || [];
    if (dateFilter && !dateFilter.granularity) {
        afmFilters = afmFilters.filter(filter => filter.id !== dateFilter.id);
    }

    if ((afmDateFilter && dateFilter && afmDateFilter.id !== dateFilter.id)
        || (afmDateFilter && !dateFilter)) {
        dateFilters.unshift(afmDateFilter);
    }

    const afmAttributeFilters = afmFilters.filter(filter => filter.type !== 'date');
    const filters = compact([
        ...afmAttributeFilters,
        ...attributeFilters,
        ...dateFilters
    ]) as IFilter[];

    return Object.assign({}, afm, { filters });
};
