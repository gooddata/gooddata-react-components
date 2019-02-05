// (C) 2007-2018 GoodData Corporation
import cloneDeep = require('lodash/cloneDeep');
import { AFM } from '@gooddata/typings';
import {
    getClickableElementNameByChartType,
    chartClick,
    cellClick,
    IHighchartsChartDrilldownEvent,
    IHighchartsPointObject
} from '../drilldownEventing';
import { VisualizationTypes } from '../../../../constants/visualizationTypes';

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
    const point: Partial<IHighchartsPointObject> = {
        x: 1,
        y: 2,
        value: 678.00,
        drillIntersection: [
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
    };
    const pointClickEventData = { point } as any as IHighchartsChartDrilldownEvent;

    it('should get clickable chart element name', () => {
        const fn = getClickableElementNameByChartType;
        expect(fn(VisualizationTypes.LINE)).toBe('point');
        expect(fn(VisualizationTypes.COLUMN)).toBe('bar');
        expect(fn(VisualizationTypes.BAR)).toBe('bar');
        expect(fn(VisualizationTypes.PIE)).toBe('slice');
        expect(fn(VisualizationTypes.TREEMAP)).toBe('slice');
        expect(fn(VisualizationTypes.HEATMAP)).toBe('cell');
        expect(fn(VisualizationTypes.TABLE)).toBe('cell');
        expect(() => {
            fn('headline'); // headline is not defined
        }).toThrowError();
    });

    it('should call point drill context (non-group) when event.points given but null', () => {
        const drillConfig = { afm, onFiredDrillEvent: () => true };
        const target = { dispatchEvent: jest.fn() };
        const pointClickEventDataWithNullPoints: IHighchartsChartDrilldownEvent = {
            ...pointClickEventData,
            points: null
        };

        chartClick(
            drillConfig,
            pointClickEventDataWithNullPoints,
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
            pointClickEventData ,
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

    it('should fire correct data with property \"value\" for treemap and heatmap', () => {
        const drillConfig = { afm, onFiredDrillEvent: () => true };
        const target = { dispatchEvent: jest.fn() };

        chartClick(
            drillConfig,
            pointClickEventData,
            target as any as EventTarget,
            VisualizationTypes.TREEMAP
        );

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail.drillContext.value).toBe('678');

        chartClick(
            drillConfig,
            pointClickEventData,
            target as any as EventTarget,
            VisualizationTypes.HEATMAP
        );

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail.drillContext.value).toBe('678');
    });

    it('should correctly handle z coordinate of point', () => {
        const drillConfig = { afm, onFiredDrillEvent: () => true };
        const target = { dispatchEvent: jest.fn() };
        const pointClickWitZEventData = cloneDeep(pointClickEventData);

        pointClickWitZEventData.point.z = 12000;

        chartClick(
            drillConfig,
            pointClickWitZEventData,
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
            pointClickEventData,
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
            pointClickEventData,
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
            pointClickEventData,
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
        const clickedPoint: Partial<IHighchartsPointObject> = {
            x: 1,
            y: 2,
            drillIntersection: [{
                id: 'id',
                title: 'title',
                header: {
                    identifier: 'identifier1',
                    uri: 'uri1'
                }
            }]
        };
        const labelClickEventData = {
            points: [
                clickedPoint
            ]
        } as any as IHighchartsChartDrilldownEvent;

        chartClick(
            drillConfig,
            labelClickEventData,
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
                id: 'id1',
                title: 'title1',
                header: {
                    identifier: 'identifier1',
                    uri: 'uri1'
                }
            }]
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
