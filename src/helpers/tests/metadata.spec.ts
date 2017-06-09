import {
    fetchMeasures,
    getAttributesMap
} from '../../helpers/metadata';

describe('metadataHelpers', () => {
    const projectId = 'projectId';
    const m1Uri = '/m/1';
    const m2Uri = '/m/2';
    const m1Format = { format: '#.##1' };
    const m2Format = { format: '#.##2' };

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
            fetchMeasures(sdkMockMetrics, projectId, {}).then((result) => {
                expect(result).toEqual({});
                done();
            });
        });

        it('should prepare mapping with formats for measures in md object', (done) => {
            const visualizationObject = {
                content: {
                    buckets: {
                        measures: [{
                            measure: { objectUri: m1Uri }
                        }, {
                            measure: { objectUri: m2Uri }
                        }]
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
            const visualizationObject = {};
            getAttributesMap(sdkMockAttributes, projectId, visualizationObject).then((result) => {
                expect(result).toEqual({});
                done();
            });
        });

        it('should return empty if date filter in filter bucket', (done) => {
            const visualizationObject = {
                content: {
                    buckets: {
                        filters: [{
                            dateFilter: {
                                attribute: dateUri
                            }
                        }]
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
                content: {
                    buckets: {
                        categories: [{
                            category: {
                                type: 'date',
                                attribute: dateUri
                            }
                        }]
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
