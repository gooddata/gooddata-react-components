import {
    fetchMeasures,
    getAttributesMap
} from '../../helpers/metadata';

import * as VisObj from '../../legacy/model/VisualizationObject';

describe('metadataHelpers', () => {
    const projectId = 'projectId';
    const m1Uri = '/m/1';
    const m2Uri = '/m/2';
    const m1Format = { format: '#.##1' };
    const m2Format = { format: '#.##2' };

    const emptyVisualizationObject = {
        meta: {},
        content: {
            type: 'column' as VisObj.VisualizationType,
            buckets: {
                measures: [],
                categories: [],
                filters: []
            }
        }
    };

    describe('fetchMeasures', () => {
        const sdkMockMetrics = {
            md: {
                getObjects: () => Promise.resolve([{
                    metric: {
                        content: m1Format,
                        meta: { uri: m1Uri }
                    }
                }, {
                    metric: {
                        content: m2Format,
                        meta: { uri: m2Uri }
                    }
                }])
            }
        };

        it('should return empty object if there are no measures', (done) => {
            fetchMeasures(sdkMockMetrics, projectId, emptyVisualizationObject).then((result) => {
                expect(result).toEqual({});
                done();
            });
        });

        it('should prepare mapping with formats for measures in md object', (done) => {
            const visualizationObject = {
                meta: {},
                content: {
                    type: 'column' as VisObj.VisualizationType,
                    buckets: {
                        measures: [{
                            measure: {
                                type: 'metric' as VisObj.MeasureType,
                                objectUri: m1Uri,
                                showInPercent: false,
                                showPoP: false,
                                title: 'metric 1',
                                measureFilters: []
                            }
                        }, {
                            measure: {
                                type: 'metric' as VisObj.MeasureType,
                                objectUri: m2Uri,
                                showInPercent: false,
                                showPoP: false,
                                title: 'metric 2',
                                measureFilters: []
                            }
                        }],
                        categories: [],
                        filters: []
                    }
                }
            };

            fetchMeasures(sdkMockMetrics, projectId, visualizationObject).then((result) => {
                expect(result).toEqual({
                    '/m/1': { measure: m1Format },
                    '/m/2': { measure: m2Format }
                });
                done();
            });
        });
    });

    describe('getAttributesMap', () => {
        const yearUri = '/gdc/md/1';
        const dateUri = '/gdc/md/2';
        const sdkMockAttributes = {
            md: {
                getObjects: () => Promise.resolve([{
                    attribute: {
                        content: {
                            type: 'GDC.time.year',
                            displayForms: [{
                                meta: { uri: yearUri }
                            }]
                        }
                    }
                }])
            }
        };

        it('should return empty if no date filter present', (done) => {
            getAttributesMap(sdkMockAttributes, projectId, emptyVisualizationObject).then((result) => {
                expect(result).toEqual({});
                done();
            });
        });

        it('should return empty if date filter in filter bucket', (done) => {
            const visualizationObject = {
                meta: {},
                content: {
                    type: 'column' as VisObj.VisualizationType,
                    buckets: {
                        measures: [],
                        categories: [],
                        filters: [
                            {
                                dateFilter: {
                                    attribute: dateUri,
                                    type: 'relative' as VisObj.EmbeddedDateFilterType,
                                    granularity: 'year'
                                }
                            }
                        ]
                    }
                }
            };

            getAttributesMap(sdkMockAttributes, projectId, visualizationObject).then((result) => {
                expect(result).toEqual({
                    [dateUri]: yearUri
                });

                done();
            });
        });

        it('should return empty if date filter in categories', (done) => {
            const visualizationObject = {
                meta:{},
                content: {
                    type: 'column' as VisObj.VisualizationType,
                    buckets: {
                        measures: [],
                        categories: [{
                            category: {
                                type: 'date' as VisObj.CategoryType,
                                attribute: dateUri,
                                collection: 'view' as VisObj.CategoryCollection,
                                displayForm: 'df/uri'
                            }
                        }],
                        filters: []
                    }
                }
            };

            getAttributesMap(sdkMockAttributes, projectId, visualizationObject).then((result) => {
                expect(result).toEqual({
                    [dateUri]: yearUri
                });

                done();
            });
        });
    });
});
