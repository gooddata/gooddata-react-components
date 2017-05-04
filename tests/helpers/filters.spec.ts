import { isNotEmptyFilter, mergeFilters } from '../../src/helpers/filters';
import { IDateFilter, IAttributeFilter, IAfm } from '../../src/interfaces/Afm';

describe('isNotEmptyFilter', () => {
    it('should return true for date filter', () => {
        const dateFilter: IDateFilter = {
            id: 'date filter',
            type: 'date',
            between: [0, 0],
            granularity: 'month'
        };

        expect(isNotEmptyFilter(dateFilter)).toBe(true);
    });

    it('should return false for empty positive filter', () => {
        const attributeFilter: IAttributeFilter = {
            id: 'empty filter',
            type: 'attribute',
            in: []
        };

        expect(isNotEmptyFilter(attributeFilter)).toBe(false);
    });

    it('should return true for filled positive filter', () => {
        const attributeFilter: IAttributeFilter = {
            id: 'filled filter',
            type: 'attribute',
            in: ['1', '2', '3']
        };

        expect(isNotEmptyFilter(attributeFilter)).toBe(true);
    });

    it('should return false for empty negative filter', () => {
        const attributeFilter: IAttributeFilter = {
            id: 'empty filter',
            type: 'attribute',
            notIn: []
        };

        expect(isNotEmptyFilter(attributeFilter)).toBe(false);
    });

    it('should return true for filled negative filter', () => {
        const attributeFilter: IAttributeFilter = {
            id: 'filled filter',
            type: 'attribute',
            notIn: ['1', '2', '3']
        };

        expect(isNotEmptyFilter(attributeFilter)).toBe(true);
    });
});

describe('mergeFilters', () => {
    it('should concat existing filters with user filters', () => {
        const afm: IAfm = {
            filters: [
                { id: 'filter', type: 'attribute', in: ['1', '2', '3'] }
            ]
        };

        const filters = [
            { id: 'user filter', type: 'attribute', in: ['4', '5', '6'] }
        ];

        expect(mergeFilters(afm, filters)).toEqual({
            filters: [
                { id: 'filter', type: 'attribute', in: ['1', '2', '3'] },
                { id: 'user filter', type: 'attribute', in: ['4', '5', '6'] }
            ]
        });
    });

    it('should handle AFM without filters', () => {
        const afm: IAfm = {};

        const filters = [
            { id: 'user filter', type: 'attribute', in: ['4', '5', '6'] }
        ];

        expect(mergeFilters(afm, filters)).toEqual({
            filters: [
                { id: 'user filter', type: 'attribute', in: ['4', '5', '6'] }
            ]
        });
    });
});
