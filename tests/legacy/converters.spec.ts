import {
    empty,
    simpleMeasure,
    popMeasure,
    popMeasureWithSorting,
    showInPercent,
    showInPercentWithDate,
    measureWithSorting,
    categoryWithSorting,
    factBasedMeasure,
    attributeBasedMeasure,
} from '../fixtures/Afm.fixtures';

import { toVisObj } from '../../src/legacy/converters';
import { VisualizationType } from '../../src/legacy/model/VisualizationObject';

const table: VisualizationType = 'bar';

describe('converters', () => {
    describe('toVizObj', () => {
        it('should convert empty AFM to empty viz. object', () => {
            const { afm, transformation } = empty;

            expect(toVisObj(table, afm, transformation)).toEqual({
                type: 'bar',

                buckets: {
                    measures: [],
                    categories: [],
                    filters: []
                }
            });
        });

        it('should convert simple measure', () => {
            const { afm, transformation } = simpleMeasure;

            expect(toVisObj(table, afm, transformation)).toEqual({
                type: 'bar',

                buckets: {
                    measures: [{
                        measure: {
                            measureFilters: [],
                            objectUri: '/gdc/md/project/obj/metric.id',
                            showInPercent: false,
                            showPoP: false,
                            title: 'Measure M1',
                            type: 'metric'
                        }
                    }],
                    categories: [],
                    filters: []
                }
            });
        });

        it('should convert fact based measure', () => {
            const { afm, transformation } = factBasedMeasure;

            expect(toVisObj(table, afm, transformation)).toEqual({
                type: 'bar',

                buckets: {
                    measures: [{
                        measure: {
                            measureFilters: [],
                            objectUri: '/gdc/md/project/obj/fact.id',
                            showInPercent: false,
                            showPoP: false,
                            title: 'SUM of Measure M1',
                            type: 'metric',
                            aggregation: 'SUM'
                        }
                    }],
                    categories: [],
                    filters: []
                }
            });
        });

        it('should convert attribute base measure', () => {
            const { afm, transformation } = attributeBasedMeasure;

            expect(toVisObj(table, afm, transformation)).toEqual({
                type: 'bar',

                buckets: {
                    measures: [{
                        measure: {
                            measureFilters: [],
                            objectUri: '/gdc/md/project/obj/attr.id',
                            showInPercent: false,
                            showPoP: false,
                            title: 'COUNT of Measure M1',
                            type: 'metric',
                            aggregation: 'COUNT'
                        }
                    }],
                    categories: [],
                    filters: []
                }
            });
        });

        it('should handle the case when no transformation is given', () => {
            const { afm  } = simpleMeasure;

            expect(toVisObj(table, afm, null)).toEqual({
                type: 'bar',

                buckets: {
                    measures: [{
                        measure: {
                            measureFilters: [],
                            objectUri: '/gdc/md/project/obj/metric.id',
                            showInPercent: false,
                            showPoP: false,
                            title: 'm1',
                            type: 'metric'
                        }
                    }],
                    categories: [],
                    filters: []
                }
            });
        });

        it('should convert show in percent measure with attribute', () => {
            const { afm, transformation } = showInPercent;

            expect(toVisObj(table, afm, transformation)).toEqual({
                type: 'bar',

                buckets: {
                    measures: [{
                        measure: {
                            measureFilters: [],
                            objectUri: '/gdc/md/project/obj/metric.id',
                            showInPercent: true,
                            showPoP: false,
                            title: 'Measure M1',
                            type: 'metric'
                        }
                    }],

                    categories: [{
                        category: {
                            type: 'attribute',
                            collection: 'attribute',
                            displayForm: '/gdc/md/project/obj/attr.id'
                        }
                    }],

                    filters: []
                }
            });
        });

        it('should convert show in percent measure with date', () => {
            const { afm, transformation } = showInPercentWithDate;

            expect(toVisObj(table, afm, transformation)).toEqual({
                type: 'bar',

                buckets: {
                    measures: [{
                        measure: {
                            measureFilters: [],
                            objectUri: '/gdc/md/project/obj/metric.id',
                            showInPercent: true,
                            showPoP: false,
                            title: 'Measure M1',
                            type: 'metric'
                        }
                    }],

                    categories: [{
                        category: {
                            collection: 'attribute',
                            displayForm: '/gdc/md/project/obj/date.id',
                            type: 'attribute'
                        }
                    }],

                    filters: []
                }
            });
        });

        it('should apply sorting to simple measure', () => {
            const { afm, transformation } = measureWithSorting;

            expect(toVisObj(table, afm, transformation)).toEqual({
                type: 'bar',

                buckets: {
                    measures: [{
                        measure: {
                            measureFilters: [],
                            objectUri: '/gdc/md/project/obj/metric.id',
                            showInPercent: false,
                            showPoP: false,
                            title: 'Measure M1',
                            type: 'metric',
                            sort: {
                                direction: 'desc',
                                sortByPoP: false
                            }
                        }
                    }],
                    categories: [],
                    filters: []
                }
            });
        });

        it('should handle measure with PoP', () => {
            const { afm, transformation } = popMeasure;

            expect(toVisObj(table, afm, transformation)).toEqual({
                type: 'bar',
                buckets: {
                    measures: [
                        {
                            measure: {
                                type: 'metric',
                                objectUri: '/gdc/md/project/obj/metric.id',
                                title: 'Measure M1',
                                measureFilters: [],
                                showInPercent: false,
                                showPoP: true,
                                sort: {
                                    direction: 'desc',
                                    sortByPoP: false
                                }
                            }
                        }
                    ],
                    categories: [
                        {
                            category: {
                                type: 'attribute',
                                collection: 'attribute',
                                displayForm: '/gdc/md/project/obj/attr.id'
                            }
                        }
                    ],
                    filters: []
                }
            });
        });

        it('should handle measure with PoP with sorting', () => {
            const { afm, transformation } = popMeasureWithSorting;

            expect(toVisObj(table, afm, transformation)).toEqual({
                type: 'bar',
                buckets: {
                    measures: [
                        {
                            measure: {
                                type: 'metric',
                                objectUri: '/gdc/md/project/obj/metric.id',
                                title: 'Measure M1',
                                measureFilters: [],
                                showInPercent: false,
                                showPoP: true,
                                sort: {
                                    direction: 'desc',
                                    sortByPoP: true
                                }
                            }
                        }
                    ],
                    categories: [
                        {
                            category: {
                                type: 'attribute',
                                collection: 'attribute',
                                displayForm: '/gdc/md/project/obj/attr.id'
                            }
                        }
                    ],
                    filters: []
                }
            });
        });

        it('should apply sorting to category', () => {
            const { afm, transformation } = categoryWithSorting;

            expect(toVisObj(table, afm, transformation)).toEqual({
                type: 'bar',

                buckets: {
                    measures: [],
                    categories: [{
                        category: {
                            collection: 'attribute',
                            displayForm: '/gdc/md/project/obj/attr.id',
                            type: 'attribute',
                            sort: 'desc'
                        }
                    }],
                    filters: []
                }
            });
        });
    });

    describe.skip('toAFM', () => ({}));
});
