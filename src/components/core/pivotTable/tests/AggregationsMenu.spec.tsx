// (C) 2007-2018 GoodData Corporation
import { AFM } from '@gooddata/typings';
import { getTotalsForMeasureHeader, getTotalsForAttributeHeader } from '../AggregationsMenu';

describe('getTotalsForMeasureHeader', () => {
    it('should return empty totals for measure when no total defined', () => {
        const measure = 'm1';
        const totals: AFM.ITotalItem[] = [
            {
                type: 'sum',
                measureIdentifier: 'm2',
                attributeIdentifier: 'a1'
            }
        ];

        expect(getTotalsForMeasureHeader(totals, measure)).toEqual([]);

    });

    it('should return totals for measure when multiple totals defined', () => {
        const measure = 'm1';
        const totals: AFM.ITotalItem[] = [
            {
                type: 'sum',
                measureIdentifier: 'm1',
                attributeIdentifier: 'a1'
            },
            {
                type: 'min',
                measureIdentifier: 'm1',
                attributeIdentifier: 'a1'
            }
        ];

        expect(getTotalsForMeasureHeader(totals, measure)).toEqual([
            {
                type: 'sum',
                attributes: ['a1']
            },
            {
                type: 'min',
                attributes: ['a1']
            }
        ]);
    });

    it('should return total for measure when total defined for multiple attributes', () => {
        const measure = 'm1';
        const totals: AFM.ITotalItem[] = [
            {
                type: 'sum',
                measureIdentifier: 'm1',
                attributeIdentifier: 'a1'
            },
            {
                type: 'sum',
                measureIdentifier: 'm1',
                attributeIdentifier: 'a2'
            }
        ];

        expect(getTotalsForMeasureHeader(totals, measure)).toEqual([
            {
                type: 'sum',
                attributes: ['a1', 'a2']
            }
        ]);
    });
});

describe('getTotalsForAttributeHeader', () => {
    it('should return empty totals when totals are not defined for all measures', () => {
        const measures = ['m1', 'm2'];
        const totals: AFM.ITotalItem[] = [
            {
                type: 'sum',
                measureIdentifier: 'm1',
                attributeIdentifier: 'a1'
            }
        ];

        expect(getTotalsForAttributeHeader(totals, measures)).toEqual([]);
    });

    it('should return totals when totals are defined for all measures', () => {
        const measures = ['m1', 'm2'];
        const totals: AFM.ITotalItem[] = [
            {
                type: 'sum',
                measureIdentifier: 'm1',
                attributeIdentifier: 'a1'
            },
            {
                type: 'sum',
                measureIdentifier: 'm2',
                attributeIdentifier: 'a1'
            }
        ];

        expect(getTotalsForAttributeHeader(totals, measures)).toEqual([
            {
                type: 'sum',
                attributes: ['a1']
            }
        ]);
    });
});
