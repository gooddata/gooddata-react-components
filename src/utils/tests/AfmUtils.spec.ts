import { appendFilters } from '../AfmUtils';
import { IAttributeFilter, IDateFilter } from '../../interfaces/Afm';

describe('appendFilters', () => {
    const af1 = {
        id: '1',
        type: 'attribute',
        in: []
    } as IAttributeFilter;
    const af2 = {
        id: '2',
        type: 'attribute',
        notIn: []
    } as IAttributeFilter;

    const df1 = {
        id: 'd1',
        type: 'date',
        granularity: 'GDC.time.year'
    } as IDateFilter;
    const df2 = {
        id: 'd2',
        type: 'date',
        granularity: 'GDC.time.year'
    } as IDateFilter;
    const df1AllTime = {
        id: 'd1',
        type: 'date'
    } as IDateFilter;

    it('should concatenate filters when all different', () => {
        const afm = {
            filters: [
                af1
            ]
        };
        const attributeFilters = [af2];
        const dateFilter = df1;

        const enriched = appendFilters(afm, attributeFilters, dateFilter);
        expect(enriched.filters).toEqual([
            af1, af2, df1
        ]);
    });

    it('should override date filter if id identical', () => {
        const afm = {
            filters: [
                af1, df1
            ]
        };
        const attributeFilters = [];
        const dateFilter = df1;

        const enriched = appendFilters(afm, attributeFilters, dateFilter);
        expect(enriched.filters).toEqual([
            af1, df1
        ]);
    });

    it('should duplicate date filter if id different', () => {
        const afm = {
            filters: [
                df1
            ]
        };
        const attributeFilters = [];
        const dateFilter = df2;

        const enriched = appendFilters(afm, attributeFilters, dateFilter);
        expect(enriched.filters).toEqual([
            df1, df2
        ]);
    });

    it('should delete date filter from afm if all time date filter requested', () => {
        const afm = {
            filters: [
                df1
            ]
        };
        const attributeFilters = [];
        const dateFilter = df1AllTime;

        const enriched = appendFilters(afm, attributeFilters, dateFilter);
        expect(enriched.filters).toEqual([]);
    });
});
