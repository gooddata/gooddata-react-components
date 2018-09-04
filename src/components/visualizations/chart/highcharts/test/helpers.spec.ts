// (C) 2007-2018 GoodData Corporation
import {
    shouldFollowPointer,
    showDataLabelInAxisRange,
    shouldStartOrEndOnTick,
    getDataLabelAttributes,
    getChartProperties,
    isLabelOverlappingItsShape,
    intersectsParentLabel
} from '../helpers';
import { VisualizationTypes } from '../../../../../constants/visualizationTypes';
import { IChartConfig } from '../../Chart';

describe('helpers', () => {
    describe('getDataLabelAttributes', () => {
        const hiddenAttributes = {
            x: 0,
            y: 0,
            height: 0,
            width: 0
        };

        it('should position data label when in range', () => {
            const result = getDataLabelAttributes({
                dataLabel: {
                    parentGroup: {
                        translateX: 0,
                        translateY: 0
                    },
                    x: 1,
                    y: 1,
                    width: 100,
                    height: 100
                }
            });

            expect(result).toEqual({
                x: 1,
                y: 1,
                width: 100,
                height: 100
            });
        });

        it('should hide data label when outside range', () => {
            const result = getDataLabelAttributes({
                dataLabel: {
                    parentGroup: {
                        translateX: 0,
                        translateY: 0
                    },
                    x: -200,
                    y: -200,
                    width: 100,
                    height: 100
                }
            });

            expect(result).toEqual(hiddenAttributes);
        });

        it('should hide label when label not present on point', () => {
            const result = getDataLabelAttributes({
                dataLabel: null
            });

            expect(result).toEqual(hiddenAttributes);
        });

        it('should hide label when label present but parentgroup missing', () => {
            const result = getDataLabelAttributes({
                dataLabel: {
                    parentGroup: null
                }
            });

            expect(result).toEqual(hiddenAttributes);
        });
    });

    describe('getChartProperties', () => {
        const config: IChartConfig = {
            xaxis: {
                rotation: '60',
                visible: false
            },
            yaxis: {
                labelsEnabled: true
            }
        };

        it('should return properties from config', () => {
            expect(getChartProperties(config, VisualizationTypes.COLUMN))
                .toEqual({
                    xAxisProps: { rotation: '60', visible: false },
                    yAxisProps: { labelsEnabled: true }
            });
        });

        it('should return properties from config for bar chart with switched axes', () => {
            expect(getChartProperties(config, VisualizationTypes.BAR))
                .toEqual({
                    yAxisProps: { rotation: '60', visible: false },
                    xAxisProps: { labelsEnabled: true }
            });
        });
    });

    describe ('shouldStartOrEndOnTick', () => {
        const nonStackedChartOptions = {
            hasStackByAttribute: false,
            data: {
                series: [
                    {
                        data: [ { y: 20 }],
                        visible: true
                    }
                ]
            }
        };

        const stackedChartOptions = {
            hasStackByAttribute: true,
            data: {
                series: [
                    {
                        data: [
                            { y: 20 },
                            { y: 10 },
                            { y: 5 }
                        ],
                        visible: true
                    }
                ]
            }
        };

        describe('Non stacked chart', () => {
            it ('should return false when min and max are set', () => {
                const chartOptions = {
                    ...nonStackedChartOptions,
                    yAxisProps: { min: '5', max: '10' }
                };
                expect(shouldStartOrEndOnTick(chartOptions)).toBeFalsy();
            });

            it ('should return false when min is greater than max', () => {
                const chartOptions = {
                    ...nonStackedChartOptions,
                    yAxisProps: { min: '10', max: '5' }
                };

                expect(shouldStartOrEndOnTick(chartOptions)).toBeTruthy();
            });

            it ('should return false if min is set but less than max data value (non stacked)', () => {
                const chartOptions = {
                    ...nonStackedChartOptions,
                    yAxisProps: { min: '10' }
                };

                expect(shouldStartOrEndOnTick(chartOptions)).toBeFalsy();
            });

            it ('should return true if min is set and bigger than max data value (non stacked)', () => {
                const chartOptions = {
                    ...nonStackedChartOptions,
                    yAxisProps: { min: '22' }
                };

                expect(shouldStartOrEndOnTick(chartOptions)).toBeTruthy();
            });

            it ('should return true when no max or min are set', () => {
                const chartOptions = {
                    ...nonStackedChartOptions,
                    yAxisProps: {}
                };

                expect(shouldStartOrEndOnTick(chartOptions)).toBeTruthy();
            });

            it ('should return true if max is set but less than min data value (non stacked)', () => {
                const chartOptions = {
                    ...nonStackedChartOptions,
                    yAxisProps: { max: '-10' }
                };

                expect(shouldStartOrEndOnTick(chartOptions)).toBeTruthy();
            });
        });

        describe('Stacked chart', () => {
            it ('should return false if min is set but less than max data value (stacked)', () => {
                const chartOptions = {
                    ...stackedChartOptions,
                    yAxisProps: { min: '10' }
                };

                expect(shouldStartOrEndOnTick(chartOptions)).toBeFalsy();
            });

            it ('should return true if min is set but serie is not visible (stacked)', () => {
                const chartOptions = {
                    ...stackedChartOptions,
                    data: {
                        series: [
                            { ...stackedChartOptions.data.series[0], visible: false }
                        ]
                    },
                    yAxisProps: { min: '10' }
                };

                expect(shouldStartOrEndOnTick(chartOptions)).toBeTruthy();
            });

            it ('should return true if min is set and greater than max data value (stacked)', () => {
                const chartOptions = {
                    ...stackedChartOptions,
                    yAxisProps: { min: '22' }
                };

                expect(shouldStartOrEndOnTick(chartOptions)).toBeTruthy();
            });

            it ('should return true if max is set but less than min data value (stacked)', () => {
                const chartOptions = {
                    ...stackedChartOptions,
                    yAxisProps: { max: '-10' }
                };

                expect(shouldStartOrEndOnTick(chartOptions)).toBeTruthy();
            });
        });
    });

    describe('showDataLabelInAxisRange', () => {
        let point: any;
        beforeEach(() => {
            point = {
                dataLabel: {
                    show: jest.fn(),
                    hide: jest.fn()
                },
                y: 100
            };
        });

        it('should hide data label when below minimum', () => {
            showDataLabelInAxisRange(point, 200);
            expect(point.dataLabel.hide).toHaveBeenCalled();
            expect(point.dataLabel.show).not.toHaveBeenCalled();
        });

        it('should show data label when in range', () => {
            showDataLabelInAxisRange(point, 0);
            expect(point.dataLabel.show).toHaveBeenCalled();
            expect(point.dataLabel.hide).not.toHaveBeenCalled();
        });
    });

    describe('shouldFollowPointer', () => {
        const nonStackedChartOptions = {
            type: VisualizationTypes.COLUMN,
            yAxes: [{ title: 'atitle' }],
            xAxes: [{ title: 'xtitle' }],
            data: {
                series: [
                    {
                        color: 'rgb(0, 0, 0)',
                        name: '<b>aaa</b>',
                        data: [
                            {
                                name: 'data1',
                                y: 50
                            },
                            {
                                name: 'data2',
                                y: 150
                            },
                            {
                                name: 'data3',
                                y: -12
                            }
                        ],
                        visible: true
                    }
                ]
            }
        };

        const stackedChartOptions = {
            type: VisualizationTypes.COLUMN,
            hasStackByAttribute: true,
            yAxes: [{ title: 'atitle' }],
            xAxes: [{ title: 'xtitle' }],
            data: {
                series: [
                    {
                        color: 'rgb(0, 0, 0)',
                        name: '<b>aaa</b>',
                        data: [
                            {
                                name: 'data1',
                                y: 25
                            },
                            {
                                name: 'data2',
                                y: 75
                            },
                            {
                                name: 'data3',
                                y: -12
                            }
                        ],
                        visible: true
                    }, {
                        color: 'rgb(0, 0, 0)',
                        name: '<b>bbb</b>',
                        data: [
                            {
                                name: 'data1',
                                y: 25
                            },
                            {
                                name: 'data2',
                                y: 75
                            },
                            {
                                name: 'data3',
                                y: -12
                            }
                        ],
                        visible: true
                    }
                ]
            }
        };

        describe('Non stacked chart', () => {
            it('should return false when no extremes are defined', () => {
                const result = shouldFollowPointer({
                    ...nonStackedChartOptions,
                    xAxisProps: {},
                    yAxisProps: {}
                });

                expect(result).toBeFalsy();
            });

            it('should return false when data values are in axis range', () => {
                const result = shouldFollowPointer({
                    ...nonStackedChartOptions,
                    yAxisProps: {
                        min: '-30',
                        max: '200'
                    }
                });

                expect(result).toBeFalsy();
            });

            it('should return true when min is in negative value', () => {
                const result = shouldFollowPointer({
                    ...nonStackedChartOptions,
                    yAxisProps: {
                        min: '-10'
                    }
                });

                expect(result).toBeTruthy();
            });

            it('should return true when min and max are within data values', () => {
                const result = shouldFollowPointer({
                    ...nonStackedChartOptions,
                    yAxisProps: {
                        min: '60',
                        max: '100'
                    }
                });

                expect(result).toBeTruthy();
            });

            it('should return true when min is bigger than minimal value', () => {
                const result = shouldFollowPointer({
                    ...nonStackedChartOptions,
                    yAxisProps: {
                        min: '0'
                    }
                });

                expect(result).toBeTruthy();
            });
        });

        describe('Stacked chart', () => {
            it('should return false when no extremes are defined', () => {
                const result = shouldFollowPointer({
                    ...stackedChartOptions,
                    xAxisProps: {},
                    yAxisProps: {}
                });

                expect(result).toBeFalsy();
            });

            it('should return false when data values are in axis range', () => {
                const result = shouldFollowPointer({
                    ...stackedChartOptions,
                    yAxisProps: {
                        min: '-30',
                        max: '200'
                    }
                });

                expect(result).toBeFalsy();
            });

            it('should return true when min and max are within data values', () => {
                const result = shouldFollowPointer({
                    ...stackedChartOptions,
                    yAxisProps: {
                        min: '60',
                        max: '100'
                    }
                });

                expect(result).toBeTruthy();
            });

            it('should return true when min is bigger than minimal value', () => {
                const result = shouldFollowPointer({
                    ...stackedChartOptions,
                    yAxisProps: {
                        min: '0'
                    }
                });

                expect(result).toBeTruthy();
            });
        });
    });

    describe('isLabelOverlappingItsShape', () => {
        const shape = {
            width: 100,
            height: 100
        };

        it('should return false when label smaller than shape', () => {
            const point = {
                dataLabel: {
                    width: 50,
                    height: 50
                },
                shapeArgs: shape
            };

            expect(isLabelOverlappingItsShape(point)).toBeFalsy();
        });

        it('should return true when label is wider than shape', () => {
            const point = {
                dataLabel: {
                    width: 150,
                    height: 50
                },
                shapeArgs: shape
            };

            expect(isLabelOverlappingItsShape(point)).toBeTruthy();
        });

        it('should return true when label is higher than shape', () => {
            const point = {
                dataLabel: {
                    width: 50,
                    height: 150
                },
                shapeArgs: shape
            };

            expect(isLabelOverlappingItsShape(point)).toBeTruthy();
        });

        it('should work also for circle', () => {
            const point = {
                dataLabel: {
                    width: 50,
                    height: 150
                },
                shapeArgs: {
                    r: 20
                }
            };

            expect(isLabelOverlappingItsShape(point)).toBeTruthy();
        });
    });

    describe('intersectsParentLabel', () => {
        function createPointWithLabel(parentId: any, dataLabel: any) {
            return {
                parent: parentId,
                dataLabel
            };
        }

        const points = [
            createPointWithLabel(undefined, { x: 0, y: 0, width: 10, height: 10 }),
            createPointWithLabel('0', { x: 100, y: 100, width: 10, height: 10 }),
            createPointWithLabel('0', { x: 0, y: 0, width: 10, height: 10 })
        ];

        it('should return false if no parent given', () => {
            const intersects = intersectsParentLabel(points[0], points);
            expect(intersects).toEqual(false);
        });

        it('should return false if parent given but no intersection', () => {
            const intersects = intersectsParentLabel(points[1], points);
            expect(intersects).toEqual(false);
        });

        it('should return true if parent given and intersects', () => {
            const intersects = intersectsParentLabel(points[2], points);
            expect(intersects).toEqual(true);
        });
    });
});
