import * as Afm from '../../interfaces/Afm';
import * as Filters from '../../helpers/filters';

describe('isNotEmptyFilter', () => {
    it('should return true for date filter', () => {
        const dateFilter: Afm.IDateFilter = {
            id: 'date filter',
            type: 'date',
            between: [0, 0],
            granularity: 'month'
        };

        expect(Filters.isNotEmptyFilter(dateFilter)).toBe(true);
    });

    it('should return false for empty positive filter', () => {
        const attributeFilter: Afm.IAttributeFilter = {
            id: 'empty filter',
            type: 'attribute',
            in: []
        };

        expect(Filters.isNotEmptyFilter(attributeFilter)).toBe(false);
    });

    it('should return true for filled positive filter', () => {
        const attributeFilter: Afm.IAttributeFilter = {
            id: 'filled filter',
            type: 'attribute',
            in: ['1', '2', '3']
        };

        expect(Filters.isNotEmptyFilter(attributeFilter)).toBe(true);
    });

    it('should return false for empty negative filter', () => {
        const attributeFilter: Afm.IAttributeFilter = {
            id: 'empty filter',
            type: 'attribute',
            notIn: []
        };

        expect(Filters.isNotEmptyFilter(attributeFilter)).toBe(false);
    });

    it('should return true for filled negative filter', () => {
        const attributeFilter: Afm.IAttributeFilter = {
            id: 'filled filter',
            type: 'attribute',
            notIn: ['1', '2', '3']
        };

        expect(Filters.isNotEmptyFilter(attributeFilter)).toBe(true);
    });
});

describe('mergeFilters', () => {
    it('should concat existing filters with user filters', () => {
        const afm: Afm.IAfm = {
            filters: [
                { id: 'filter', type: 'attribute', in: ['1', '2', '3'] }
            ]
        };

        const filters: Afm.IAttributeFilter[] = [
            { id: 'user filter', type: 'attribute', in: ['4', '5', '6'] }
        ];

        expect(Filters.mergeFilters(afm, filters)).toEqual({
            filters: [
                { id: 'filter', type: 'attribute', in: ['1', '2', '3'] },
                { id: 'user filter', type: 'attribute', in: ['4', '5', '6'] }
            ]
        });
    });

    it('should handle AFM without filters', () => {
        const afm: Afm.IAfm = {};

        const filters: Afm.IAttributeFilter[] = [
            { id: 'user filter', type: 'attribute', in: ['4', '5', '6'] }
        ];

        expect(Filters.mergeFilters(afm, filters)).toEqual({
            filters: [
                { id: 'user filter', type: 'attribute', in: ['4', '5', '6'] }
            ]
        });
    });
});
