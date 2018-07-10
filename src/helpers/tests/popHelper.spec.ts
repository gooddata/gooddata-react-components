// (C) 2007-2018 GoodData Corporation
import { fillPoPTitlesAndAliases, getPoPSuffix } from '../popHelper';
import { visualizationObjects } from '../../../__mocks__/fixtures';

describe('popHelper', () => {
    describe('fillPoPTitlesAndAliases', () => {
        it('should set title of derived measures based on master measure title when master measure is NOT ' +
            'renamed', () => {
            const visContentWithPoP = visualizationObjects.find(chart =>
                chart.visualizationObject.meta.title === 'PoP'
            ).visualizationObject.content;
            expect(fillPoPTitlesAndAliases(visContentWithPoP, ' - testing pop title').buckets[0].items).toEqual(
                [
                    {
                        measure: {
                            localIdentifier: 'm1',
                            title: '# Accounts with AD Query',
                            definition: {
                                measureDefinition: {
                                    item: {
                                        uri: '/gdc/md/myproject/obj/8172'
                                    }
                                }
                            }
                        }
                    },
                    {
                        measure: {
                            localIdentifier: 'm1_pop',
                            title: '# Accounts with AD Query - testing pop title',
                            definition: {
                                popMeasureDefinition: {
                                    measureIdentifier: 'm1',
                                    popAttribute: {
                                        uri: '/gdc/md/myproject/obj/1514'
                                    }
                                }
                            }
                        }
                    },
                    {
                        measure: {
                            localIdentifier: 'm1_previous_period',
                            title: '# Accounts with AD Query - testing pop title',
                            definition: {
                                previousPeriodMeasure: {
                                    measureIdentifier: 'm1',
                                    dateDataSets: [{
                                        dataSet: {
                                            uri: '/gdc/md/myproject/obj/921'
                                        },
                                        periodsAgo: 1
                                    }]
                                }
                            }
                        }
                    }
                ]
            );
        });

        it('should set title of derived measures based on master measure alias when master measure is ' +
            'renamed', () => {
            const visContentWithPoP = visualizationObjects.find(chart =>
                chart.visualizationObject.meta.title === 'PoP alias test'
            ).visualizationObject.content;
            expect(fillPoPTitlesAndAliases(visContentWithPoP, ' - testing pop title').buckets[0].items).toEqual(
                [
                    {
                        measure: {
                            localIdentifier: 'm1',
                            title: '# Accounts with AD Query',
                            alias: 'AD Queries',
                            definition: {
                                measureDefinition: {
                                    item: {
                                        uri: '/gdc/md/myproject/obj/8172'
                                    }
                                }
                            }
                        }
                    },
                    {
                        measure: {
                            localIdentifier: 'm1_pop',
                            title: 'AD Queries - testing pop title',
                            definition: {
                                popMeasureDefinition: {
                                    measureIdentifier: 'm1',
                                    popAttribute: {
                                        uri: '/gdc/md/myproject/obj/1514'
                                    }
                                }
                            }
                        }
                    },
                    {
                        measure: {
                            localIdentifier: 'm1_previous_period',
                            title: 'AD Queries - testing pop title',
                            definition: {
                                previousPeriodMeasure: {
                                    measureIdentifier: 'm1',
                                    dateDataSets: [{
                                        dataSet: {
                                            uri: '/gdc/md/myproject/obj/921'
                                        },
                                        periodsAgo: 1
                                    }]
                                }
                            }
                        }
                    }
                ]
            );
        });

        it('should set title of derived measures based on master measure title even when master measure is ' +
            'located in a different bucket', () => {
            const headlineWithPoP = visualizationObjects.find(visualizationObject =>
                visualizationObject.visualizationObject.meta.title === 'pop headline test'
            ).visualizationObject.content;

            const updatedVisualizationObjectContent = fillPoPTitlesAndAliases(headlineWithPoP, ' - testing pop title');
            expect(updatedVisualizationObjectContent.buckets[0].items).toEqual(
                [
                    {
                        measure: {
                            localIdentifier: 'fdd41e4ca6224cd2b5ecce15fdabf062',
                            title: 'Sum of Email Clicks',
                            format: '#,##0.00',
                            definition: {
                                measureDefinition: {
                                    aggregation: 'sum',
                                    item: {
                                        uri: '/gdc/md/yrungi0zwpoud7h1kmh6ldhp0vgkpi41/obj/15428'
                                    }
                                }
                            }
                        }
                    }
                ]
            );
            expect(updatedVisualizationObjectContent.buckets[1].items).toEqual(
                [
                    {
                        measure: {
                            localIdentifier: 'fdd41e4ca6224cd2b5ecce15fdabf062_pop',
                            title: 'Sum of Email Clicks - testing pop title',
                            definition: {
                                popMeasureDefinition: {
                                    measureIdentifier: 'fdd41e4ca6224cd2b5ecce15fdabf062',
                                    popAttribute: {
                                        uri: '/gdc/md/yrungi0zwpoud7h1kmh6ldhp0vgkpi41/obj/15330'
                                    }
                                }
                            }
                        }
                    },
                    {
                        measure: {
                            localIdentifier: 'fdd41e4ca6224cd2b5ecce15fdabf062_previous_period',
                            title: 'Sum of Email Clicks - testing pop title',
                            definition: {
                                previousPeriodMeasure: {
                                    measureIdentifier: 'fdd41e4ca6224cd2b5ecce15fdabf062',
                                    dateDataSets: [{
                                        dataSet: {
                                            uri: '/gdc/md/yrungi0zwpoud7h1kmh6ldhp0vgkpi41/obj/921'
                                        },
                                        periodsAgo: 1
                                    }]
                                }
                            }
                        }
                    }
                ]
            );
        });
    });

    describe('getPoPSuffix', () => {
        it('should return formatted suffix for popMeasureDefinition', () => {
            const popSuffix = getPoPSuffix('popMeasureDefinition', 'en-US');
            expect(popSuffix).toEqual(' - SP year ago');
        });

        it('should return formatted suffix for overPeriodMeasure', () => {
            const popSuffix = getPoPSuffix('overPeriodMeasure', 'en-US');
            expect(popSuffix).toEqual(' - SP year ago');
        });

        it('should return formatted suffix for previousPeriodMeasure', () => {
            const popSuffix = getPoPSuffix('previousPeriodMeasure', 'en-US');
            expect(popSuffix).toEqual(' - previous period');
        });
    });
});
