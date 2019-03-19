// (C) 2019 GoodData Corporation
import { AFM, Execution } from '@gooddata/typings';
import { FIELD_TYPE_ATTRIBUTE, FIELD_TYPE_MEASURE } from '../../../../helpers/agGrid';
import aggregationsMenuHelper from '../aggregationsMenuHelper';

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

        expect(aggregationsMenuHelper.getTotalsForMeasureHeader(totals, measure)).toEqual([]);

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

        expect(aggregationsMenuHelper.getTotalsForMeasureHeader(totals, measure)).toEqual([
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

        expect(aggregationsMenuHelper.getTotalsForMeasureHeader(totals, measure)).toEqual([
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

        expect(aggregationsMenuHelper.getTotalsForAttributeHeader(totals, measures)).toEqual([]);
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

        expect(aggregationsMenuHelper.getTotalsForAttributeHeader(totals, measures)).toEqual([
            {
                type: 'sum',
                attributes: ['a1']
            }
        ]);
    });
});

describe('getHeaderMeasureLocalIdentifiers', () => {
    describe('attribute header', () => {
        const lastFieldType = FIELD_TYPE_ATTRIBUTE;
        const lastFieldId = 'whatever';

        it('should return empty list when no measure header items provided', () => {
            const measureGroupHeaderItems: Execution.IMeasureHeaderItem[] = [];

            expect(aggregationsMenuHelper.getHeaderMeasureLocalIdentifiers(
                measureGroupHeaderItems,
                lastFieldType,
                lastFieldId
            )).toEqual([]);
        });

        it('should return measure identifiers when multiple measure headers provided', () => {
            const measureGroupHeaderItems: Execution.IMeasureHeaderItem[] = [
                {
                    measureHeaderItem: {
                        localIdentifier: 'foo',
                        name: '',
                        format: ''
                    }
                },
                {
                    measureHeaderItem: {
                        localIdentifier: 'bar',
                        name: '',
                        format: ''
                    }
                }
            ];

            expect(aggregationsMenuHelper.getHeaderMeasureLocalIdentifiers(
                measureGroupHeaderItems,
                lastFieldType,
                lastFieldId
            )).toEqual([
                'foo',
                'bar'
            ]);
        });
    });

    describe('measure header', () => {
        const lastFieldType = FIELD_TYPE_MEASURE;
        const lastFieldId = 0;
        const measureGroupHeaderItems: Execution.IMeasureHeaderItem[] = [
            {
                measureHeaderItem: {
                    localIdentifier: 'foo',
                    name: '',
                    format: ''
                }
            },
            {
                measureHeaderItem: {
                    localIdentifier: 'bar',
                    name: '',
                    format: ''
                }
            }
        ];

        it('should throw error no measure header items provided', () => {
            expect(aggregationsMenuHelper.getHeaderMeasureLocalIdentifiers.bind(
                this, [], lastFieldType, lastFieldId
            )).toThrowError();
        });

        it('should throw error when uknown field type provided', () => {
            expect(aggregationsMenuHelper.getHeaderMeasureLocalIdentifiers.bind(
                this, measureGroupHeaderItems, 'X', lastFieldId
            )).toThrowError();
        });

        it('should return first measure identifier when multiple measure headers provided', () => {
            expect(aggregationsMenuHelper.getHeaderMeasureLocalIdentifiers(
                measureGroupHeaderItems, lastFieldType, lastFieldId
            )).toEqual([
                'foo'
            ]);
        });
    });
});