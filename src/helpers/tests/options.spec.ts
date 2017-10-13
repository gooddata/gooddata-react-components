import { AFM } from '@gooddata/typings';
import { getVisualizationOptions } from '../options';

describe('getVisualizationOptions', () => {
    function createAfm(measures: AFM.IMeasure[]): AFM.IAfm {
        return  {
            measures
        };
    }

    function createDateFilter(): AFM.IRelativeDateFilter {
        return {
            relativeDateFilter: {
                dataSet: {
                    identifier: 'foo'
                },
                from: -1,
                to: -1,
                granularity: 'GDC.time.year'
            }
        };
    }

    function createAttributeFilter(): AFM.IPositiveAttributeFilter {
        return {
            positiveAttributeFilter: {
                displayForm: {
                    identifier: 'foo'
                },
                in: []
            }
        };
    }

    function createMeasure(filters: AFM.FilterItem[]): AFM.IMeasure {
        return {
            localIdentifier: 'foo',
            definition: {
                measure: {
                    item: {
                        identifier: 'bar'
                    },
                    filters
                }
            }
        };
    }

    describe('dateOptionsDisabled', () => {
        it('should return true if all metrics use date filter', () => {
            const afm = createAfm([
                createMeasure([createDateFilter()]),
                createMeasure([createDateFilter()])
            ]);
            expect(getVisualizationOptions(afm)).toHaveProperty('dateOptionsDisabled', true);
        });

        it('should return true if all metrics use date filter and also attribute filter', () => {
            const afm = createAfm([
                createMeasure([createDateFilter(), createAttributeFilter()]),
                createMeasure([createDateFilter()])
            ]);
            expect(getVisualizationOptions(afm)).toHaveProperty('dateOptionsDisabled', true);
        });

        it('should return false if all metrics use attribute filter only', () => {
            const afm = createAfm([
                createMeasure([createAttributeFilter()]),
                createMeasure([createAttributeFilter()])
            ]);
            expect(getVisualizationOptions(afm)).toHaveProperty('dateOptionsDisabled', false);
        });

        it('should return false if some metrics use attribute filter and some date filter', () => {
            const afm = createAfm([
                createMeasure([createAttributeFilter()]),
                createMeasure([createDateFilter()])
            ]);
            expect(getVisualizationOptions(afm)).toHaveProperty('dateOptionsDisabled', false);
        });

        it('should return false if some metric use date filter, but some does not use any filter', () => {
            const afm = createAfm([
                createMeasure([createDateFilter()]),
                createMeasure([])
            ]);
            expect(getVisualizationOptions(afm)).toHaveProperty('dateOptionsDisabled', false);
        });

        it('should return false if there are no metrics', () => {
            const afm = createAfm([]);
            expect(getVisualizationOptions(afm)).toHaveProperty('dateOptionsDisabled', false);
        });

        it('should return false if AFM is empty object', () => {
            const afm = {};
            expect(getVisualizationOptions(afm)).toHaveProperty('dateOptionsDisabled', false);
        });
    });
});
