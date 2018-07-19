// (C) 2007-2018 GoodData Corporation
import cloneDeep = require('lodash/cloneDeep');
import { AFM } from '@gooddata/typings';

import {
    getClickableElementNameByChartType,
    chartClick,
    cellClick,
    isDrillable,
    IHighchartsChartDrilldownEvent,
    getMeasureUriOrIdentifier
} from '../drilldownEventing';
import { VisualizationTypes } from '../../../../constants/visualizationTypes';

describe('isDrillable', () => {
    const PURE_MEASURE_URI = '/gdc/md/projectId/obj/1';
    const PURE_MEASURE_IDENTIFIER = 'MEASURE.identifier';
    const ADHOC_MEASURE_LOCAL_IDENTIFIER = 'm1';
    const ADHOC_MEASURE_URI = '/gdc/md/projectId/obj/2';
    const DATE_DATA_SET_URI = '/gdc/md/projectId/obj/3';
    const ADHOC_MEASURE_IDENTIFIER = 'adhoc.measure.identifier';
    const ADHOC_MEASURE_POP_LOCAL_IDENTIFIER = 'm1_pop';
    const ADHOC_MEASURE_PREVIOUS_PERIOD_LOCAL_IDENTIFIER = 'm1_previous_period';

    const drillableItems = [
        {
            uri: PURE_MEASURE_URI,
            identifier: PURE_MEASURE_IDENTIFIER
        },
        {
            uri: ADHOC_MEASURE_URI,
            identifier: ADHOC_MEASURE_IDENTIFIER
        }
    ];

    describe('Header with uri or identifier (pure measures & attributes)', () => {
        it('should be true if uri is found in drillableItems', () => {
            const header = {
                uri: PURE_MEASURE_URI
            };
            expect(
                isDrillable(drillableItems, header, {})
            ).toEqual(true);
        });

        it('should be true if identifier is found in drillableItems', () => {
            const header = {
                identifier: PURE_MEASURE_IDENTIFIER
            };
            expect(
                isDrillable(drillableItems, header, {})
            ).toEqual(true);
        });
    });

    describe('Header without uri & identifier (adhoc measures)', () => {
        it('should be true if uri based measure in AFM is found in drillableItems', () => {
            const header = {
                localIdentifier: ADHOC_MEASURE_LOCAL_IDENTIFIER
            };
            const afm = {
                measures: [
                    {
                        localIdentifier: ADHOC_MEASURE_LOCAL_IDENTIFIER,
                        definition: {
                            measure: {
                                item: {
                                    uri: ADHOC_MEASURE_URI
                                }
                            }
                        }
                    }
                ]
            };
            expect(
                isDrillable(drillableItems, header, afm)
            ).toEqual(true);
        });

        it('should be true if identifier based measure in AFM is found in drillableItems', () => {
            const header = {
                localIdentifier: ADHOC_MEASURE_LOCAL_IDENTIFIER
            };
            const afm = {
                measures: [
                    {
                        localIdentifier: ADHOC_MEASURE_LOCAL_IDENTIFIER,
                        definition: {
                            measure: {
                                item: {
                                    identifier: ADHOC_MEASURE_IDENTIFIER
                                }
                            }
                        }
                    }
                ]
            };
            expect(
                isDrillable(drillableItems, header, afm)
            ).toEqual(true);
        });

        it('should detect PoP in AFM', () => {
            const header = {
                localIdentifier: ADHOC_MEASURE_POP_LOCAL_IDENTIFIER
            };
            const afm = {
                measures: [
                    {
                        localIdentifier: ADHOC_MEASURE_LOCAL_IDENTIFIER,
                        definition: {
                            measure: {
                                item: {
                                    uri: ADHOC_MEASURE_URI
                                }
                            }
                        }
                    }, {
                        localIdentifier: ADHOC_MEASURE_POP_LOCAL_IDENTIFIER,
                        definition: {
                            popMeasure: {
                                measureIdentifier: ADHOC_MEASURE_LOCAL_IDENTIFIER,
                                popAttribute: {
                                    uri: ADHOC_MEASURE_URI
                                }
                            }
                        }
                    }
                ]
            };
            expect(
                isDrillable(drillableItems, header, afm)
            ).toEqual(true);
        });

        it('should detect previous period in AFM', () => {
            const header = {
                localIdentifier: ADHOC_MEASURE_PREVIOUS_PERIOD_LOCAL_IDENTIFIER
            };
            const afm = {
                measures: [
                    {
                        localIdentifier: ADHOC_MEASURE_LOCAL_IDENTIFIER,
                        definition: {
                            measure: {
                                item: {
                                    uri: ADHOC_MEASURE_URI
                                }
                            }
                        }
                    }, {
                        localIdentifier: ADHOC_MEASURE_PREVIOUS_PERIOD_LOCAL_IDENTIFIER,
                        definition: {
                            previousPeriodMeasure: {
                                measureIdentifier: ADHOC_MEASURE_LOCAL_IDENTIFIER,
                                dateDataSets: [{
                                    dataSet: {
                                        uri: DATE_DATA_SET_URI
                                    },
                                    periodsAgo: 1
                                }]
                            }
                        }
                    }
                ]
            };
            expect(
                isDrillable(drillableItems, header, afm)
            ).toEqual(true);
        });
    });
});

describe('Drilldown Eventing', () => {
    jest.useFakeTimers();
    const ADHOC_MEASURE_LOCAL_IDENTIFIER = 'm1';
    const ADHOC_MEASURE_URI = '/gdc/md/projectId/obj/2';
    const afm: AFM.IAfm = {
        measures: [
            {
                localIdentifier: ADHOC_MEASURE_LOCAL_IDENTIFIER,
                definition: {
                    measure: {
                        item: {
                            uri: ADHOC_MEASURE_URI
                        }
                    }
                }
            }
        ]
    };

    const pointClickEventData = {
        point: {
            x: 1,
            y: 2,
            drillContext: [
                {
                    id: 'id',
                    title: 'title',
                    value: '123',
                    name: 'name1',
                    identifier: 'identifier1',
                    uri: 'uri1',
                    some: 'nonrelevant data'
                },
                {
                    id: 'id',
                    title: 'title',
                    value: '123',
                    name: 'name2',
                    identifier: 'identifier2',
                    uri: 'uri2'
                },
                {
                    id: 'id',
                    title: 'title',
                    value: '123',
                    name: 'name3',
                    identifier: 'identifier3',
                    uri: 'uri3'
                }
            ],
            some: 'nonrelevant data'
        }
    };

    const pointClickWitZEventData = cloneDeep(pointClickEventData);
    (pointClickWitZEventData as any as IHighchartsChartDrilldownEvent).point.z = 12000;

    it('should get clickable chart element name', () => {
        const fn = getClickableElementNameByChartType;
        expect(fn(VisualizationTypes.LINE)).toBe('point');
        expect(fn(VisualizationTypes.COLUMN)).toBe('bar');
        expect(fn(VisualizationTypes.BAR)).toBe('bar');
        expect(fn(VisualizationTypes.PIE)).toBe('slice');
        expect(fn(VisualizationTypes.TREEMAP)).toBe('slice');
        expect(fn(VisualizationTypes.TABLE)).toBe('cell');
        expect(() => {
            fn('headline'); // headline is not defined
        }).toThrowError();
    });

    it('should call point drill context (non-group) when event.points given but null', () => {
        const drillConfig = { afm, onFiredDrillEvent: () => true };
        const target = { dispatchEvent: jest.fn() };

        chartClick(
            drillConfig,
            {
                ...pointClickEventData,
                points: null
            } as any as IHighchartsChartDrilldownEvent,
            target as any as EventTarget,
            VisualizationTypes.LINE
        );

        jest.runAllTimers();

        const drillContext = target.dispatchEvent.mock.calls[0][0].detail.drillContext;
        expect(drillContext.element).toEqual('point');
    });

    it('should call default fire event on point click and fire correct data', () => {
        const drillConfig = { afm, onFiredDrillEvent: () => true };
        const target = { dispatchEvent: jest.fn() };

        chartClick(
            drillConfig,
            pointClickEventData as any as IHighchartsChartDrilldownEvent,
            target as any as EventTarget,
            VisualizationTypes.LINE
        );

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual({
            executionContext: {
                measures: [
                    {
                        localIdentifier: ADHOC_MEASURE_LOCAL_IDENTIFIER,
                        definition: {
                            measure: {
                                item: {
                                    uri: ADHOC_MEASURE_URI
                                }
                            }
                        }
                    }
                ]
            },
            drillContext: {
                type: 'line',
                element: 'point',
                x: 1,
                y: 2,
                intersection: [
                    {
                        id: 'id',
                        title: 'title',
                        header: {
                            identifier: 'identifier1',
                            uri: 'uri1'
                        }
                    },
                    {
                        id: 'id',
                        title: 'title',
                        header: {
                            identifier: 'identifier2',
                            uri: 'uri2'
                        }
                    },
                    {
                        id: 'id',
                        title: 'title',
                        header: {
                            identifier: 'identifier3',
                            uri: 'uri3'
                        }
                    }
                ]
            }
        });
    });

    it('should correctly handle z coordinate of point', () => {
        const drillConfig = { afm, onFiredDrillEvent: () => true };
        const target = { dispatchEvent: jest.fn() };

        chartClick(
            drillConfig,
            pointClickWitZEventData as any as IHighchartsChartDrilldownEvent,
            target as any as EventTarget,
            VisualizationTypes.BUBBLE
        );

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual({
            executionContext: {
                measures: [
                    {
                        localIdentifier: ADHOC_MEASURE_LOCAL_IDENTIFIER,
                        definition: {
                            measure: {
                                item: {
                                    uri: ADHOC_MEASURE_URI
                                }
                            }
                        }
                    }
                ]
            },
            drillContext: {
                type: 'bubble',
                element: 'point',
                x: 1,
                y: 2,
                z: 12000,
                intersection: [
                    {
                        id: 'id',
                        title: 'title',
                        header: {
                            identifier: 'identifier1',
                            uri: 'uri1'
                        }
                    },
                    {
                        id: 'id',
                        title: 'title',
                        header: {
                            identifier: 'identifier2',
                            uri: 'uri2'
                        }
                    },
                    {
                        id: 'id',
                        title: 'title',
                        header: {
                            identifier: 'identifier3',
                            uri: 'uri3'
                        }
                    }
                ]
            }
        });
    });

    it('should call user defined callback on point click', () => {
        const drillConfig = { afm, onFiredDrillEvent: jest.fn() };
        const target = { dispatchEvent: () => true };

        chartClick(
            drillConfig,
            pointClickEventData as any as IHighchartsChartDrilldownEvent,
            target as any as EventTarget,
            VisualizationTypes.LINE
        );

        jest.runAllTimers();

        expect(drillConfig.onFiredDrillEvent).toHaveBeenCalled();
    });

    it('should call both default fire event and user defined callback on point click', () => {
        const drillConfig = { afm, onFiredDrillEvent: jest.fn() };
        const target = { dispatchEvent: jest.fn() };

        chartClick(
            drillConfig,
            pointClickEventData as any as IHighchartsChartDrilldownEvent,
            target as any as EventTarget,
            VisualizationTypes.LINE
        );

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();
        expect(drillConfig.onFiredDrillEvent).toHaveBeenCalled();
    });

    it('should only call user defined callback on point click', () => {
        const drillConfig = { afm, onFiredDrillEvent: jest.fn().mockReturnValue(false) };
        const target = { dispatchEvent: jest.fn() };

        chartClick(
            drillConfig,
            pointClickEventData as any as IHighchartsChartDrilldownEvent,
            target as any as EventTarget,
            VisualizationTypes.LINE
        );

        jest.runAllTimers();

        expect(target.dispatchEvent).not.toHaveBeenCalled();
        expect(drillConfig.onFiredDrillEvent).toHaveBeenCalled();
    });

    it('should call fire event on label click', () => {
        const drillConfig = { afm, onFiredDrillEvent: () => true };
        const target = { dispatchEvent: jest.fn() };
        const labelClickEventData = {
            points: [{
                x: 1,
                y: 2,
                drillContext: [
                    {
                        id: 'id',
                        title: 'title',
                        identifier: 'identifier1',
                        uri: 'uri1',
                        value: '123',
                        name: 'name1',
                        some: 'nonrelevant data'
                    }
                ],
                some: 'nonrelevant data'
            }]
        };

        chartClick(
            drillConfig,
            labelClickEventData as any as IHighchartsChartDrilldownEvent,
            target as any as EventTarget,
            VisualizationTypes.LINE
        );

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual({
            executionContext: {
                measures: [
                    {
                        localIdentifier: ADHOC_MEASURE_LOCAL_IDENTIFIER,
                        definition: {
                            measure: {
                                item: {
                                    uri: ADHOC_MEASURE_URI
                                }
                            }
                        }
                    }
                ]
            },
            drillContext: {
                type: 'line',
                element: 'label',
                points: [{
                    x: 1,
                    y: 2,
                    intersection: [
                        {
                            id: 'id',
                            title: 'title',
                            header: {
                                identifier: 'identifier1',
                                uri: 'uri1'
                            }
                        }
                    ]

                }]
            }
        });
    });

    it('should call fire event on cell click', () => {
        const drillConfig = { afm, onFiredDrillEvent: () => true };
        const target = { dispatchEvent: jest.fn() };
        const cellClickEventData = {
            columnIndex: 1,
            rowIndex: 2,
            row: ['3'],
            intersection: [{
                title: 'title1',
                id: 'id1',
                identifier: 'identifier1',
                uri: 'uri1',
                name: 'name1',
                value: '123',
                some: 'irrelevant data'
            }],
            some: 'nonrelevant data'
        };

        cellClick(
            drillConfig,
            cellClickEventData,
            target as any as EventTarget
        );

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual({
            executionContext: {
                measures: [
                    {
                        localIdentifier: ADHOC_MEASURE_LOCAL_IDENTIFIER,
                        definition: {
                            measure: {
                                item: {
                                    uri: ADHOC_MEASURE_URI
                                }
                            }
                        }
                    }
                ]
            },
            drillContext: {
                type: 'table',
                element: 'cell',
                columnIndex: 1,
                rowIndex: 2,
                row: ['3'],
                intersection: [{
                    id: 'id1',
                    title: 'title1',
                    header: {
                        identifier: 'identifier1',
                        uri: 'uri1'
                    }
                }]
            }
        });
    });
});

describe('getMeasureUriOrIdentifier', () => {
    describe('simple measure', () => {
        function buildAfm(simpleMeasureItem: AFM.ObjQualifier): AFM.IAfm {
            return {
                measures: [{
                    localIdentifier: 'm1',
                    definition: {
                        measure: {
                            item: simpleMeasureItem
                        }
                    }
                }]
            };
        }

        it('should return null when measure with the local identifier is not found', () => {
            const afm = buildAfm({
                uri: '/uri'
            });
            const result = getMeasureUriOrIdentifier(afm, 'm2');
            expect(result).toBeNull();
        });

        it('should return uri when measure with the local identifier has uri', () => {
            const afm = buildAfm({
                uri: '/uri'
            });
            const result = getMeasureUriOrIdentifier(afm, 'm1');
            expect(result).toEqual({
                uri: '/uri',
                identifier: undefined
            });
        });

        it('should return identifier when measure with the local identifier has identifier', () => {
            const afm = buildAfm({
                identifier: 'id'
            });
            const result = getMeasureUriOrIdentifier(afm, 'm1');
            expect(result).toEqual({
                uri: undefined,
                identifier: 'id'
            });
        });

        it('should return both uri and identifier when measure with the local identifier has both', () => {
            const afm = buildAfm({
                identifier: 'id',
                uri: '/uri'
            });
            const result = getMeasureUriOrIdentifier(afm, 'm1');
            expect(result).toEqual({
                uri: '/uri',
                identifier: 'id'
            });
        });
    });

    describe('PoP measure', () => {
        function buildAfm(simpleMeasureItem: AFM.ObjQualifier): AFM.IAfm {
            return {
                measures: [{
                    localIdentifier: 'm1',
                    definition: {
                        measure: {
                            item: simpleMeasureItem
                        }
                    }
                }, {
                    localIdentifier: 'm2',
                    definition: {
                        popMeasure: {
                            measureIdentifier: 'm1',
                            popAttribute: {
                                uri: '/date-attribute-uri'
                            }
                        }
                    }
                }]
            };
        }

        it('should return null when derived measure with the local identifier is not found', () => {
            const afm = buildAfm({
                uri: '/uri'
            });
            const result = getMeasureUriOrIdentifier(afm, 'm3');
            expect(result).toBeNull();
        });

        it('should return null when derived measure with a local identifier identifies unknown measure', () => {
            const afm = {
                measures: [{
                    localIdentifier: 'm1',
                    definition: {
                        measure: {
                            item: {
                                uri: '/uri'
                            }
                        }
                    }
                }, {
                    localIdentifier: 'm2',
                    definition: {
                        popMeasure: {
                            measureIdentifier: 'm3',
                            popAttribute: {
                                uri: '/pop-uri'
                            }
                        }
                    }
                }]
            };
            const result = getMeasureUriOrIdentifier(afm, 'm2');
            expect(result).toBeNull();
        });

        it('should return uri when master of derived measure with the local identifier has uri', () => {
            const afm = buildAfm({
                uri: '/uri'
            });
            const result = getMeasureUriOrIdentifier(afm, 'm2');
            expect(result).toEqual({
                uri: '/uri',
                identifier: undefined
            });
        });

        it('should return identifier when master of derived with the local identifier has identifier', () => {
            const afm = buildAfm({
                identifier: 'id'
            });
            const result = getMeasureUriOrIdentifier(afm, 'm2');
            expect(result).toEqual({
                uri: undefined,
                identifier: 'id'
            });
        });

        it('should return both uri and identifier when master of derived with the local identifier has both', () => {
            const afm = buildAfm({
                identifier: 'id',
                uri: '/uri'
            });
            const result = getMeasureUriOrIdentifier(afm, 'm2');
            expect(result).toEqual({
                uri: '/uri',
                identifier: 'id'
            });
        });
    });

    describe('previous period measure', () => {
        function buildAfm(simpleMeasureItem: AFM.ObjQualifier): AFM.IAfm {
            return {
                measures: [{
                    localIdentifier: 'm1',
                    definition: {
                        measure: {
                            item: simpleMeasureItem
                        }
                    }
                }, {
                    localIdentifier: 'm2',
                    definition: {
                        previousPeriodMeasure: {
                            measureIdentifier: 'm1',
                            dateDataSets: [{
                                dataSet: {
                                    uri: '/data-set-uri'
                                },
                                periodsAgo: 1
                            }]
                        }
                    }
                }]
            };
        }

        it('should return null when derived measure with the local identifier is not found', () => {
            const afm = buildAfm({
                uri: '/uri'
            });
            const result = getMeasureUriOrIdentifier(afm, 'm3');
            expect(result).toBeNull();
        });

        it('should return null when derived measure with a local identifier identifies unknown measure', () => {
            const afm = {
                measures: [{
                    localIdentifier: 'm1',
                    definition: {
                        measure: {
                            item: {
                                uri: '/uri'
                            }
                        }
                    }
                }, {
                    localIdentifier: 'm2',
                    definition: {
                        previousPeriodMeasure: {
                            measureIdentifier: 'm3',
                            dateDataSets: [{
                                dataSet: {
                                    uri: '/data-set-uri'
                                },
                                periodsAgo: 1
                            }]
                        }
                    }
                }]
            };
            const result = getMeasureUriOrIdentifier(afm, 'm2');
            expect(result).toBeNull();
        });

        it('should return uri when master of derived measure with the local identifier has uri', () => {
            const afm = buildAfm({
                uri: '/uri'
            });
            const result = getMeasureUriOrIdentifier(afm, 'm2');
            expect(result).toEqual({
                uri: '/uri',
                identifier: undefined
            });
        });

        it('should return identifier when master of derived with the local identifier has identifier', () => {
            const afm = buildAfm({
                identifier: 'id'
            });
            const result = getMeasureUriOrIdentifier(afm, 'm2');
            expect(result).toEqual({
                uri: undefined,
                identifier: 'id'
            });
        });

        it('should return both uri and identifier when master of derived with the local identifier has both', () => {
            const afm = buildAfm({
                identifier: 'id',
                uri: '/uri'
            });
            const result = getMeasureUriOrIdentifier(afm, 'm2');
            expect(result).toEqual({
                uri: '/uri',
                identifier: 'id'
            });
        });
    });
});
