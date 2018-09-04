// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import ChartTransformation from '../ChartTransformation';
import * as fixtures from '../../../../../stories/test_data/fixtures';
import { TOP } from '../legend/PositionTypes';
import HighChartsRenderer from '../HighChartsRenderer';
import noop = require('lodash/noop');
import { IChartConfig } from '../Chart';

describe('ChartTransformation', () => {
    const defaultProps = {
        ...fixtures.barChartWithoutAttributes,
        config: {
            type: 'column',
            legend: {
                enabled: true,
                position: 'right'
            },
            legendLayout: 'horizontal'
        },
        onDataTooLarge: noop,
        onNegativeValuess: noop
    };

    function createComponent(customProps: any = {}) {
        const props = { ...defaultProps, ...customProps };
        return <ChartTransformation {...props} />;
    }

    it('should use custom renderer', () => {
        const renderer = jest.fn().mockReturnValue(<div />);
        mount(createComponent({ renderer }));
        expect(renderer).toHaveBeenCalledTimes(1);
    });

    it('should use custom color palette', () => {
        let colorPalette;
        const customColors = ['#000000', '#ff0000'];
        const renderer = (params: any) => {
            colorPalette = params.chartOptions.colorPalette;
            return <div />;
        };
        const componentProps = {
            renderer,
            ...fixtures.barChartWithStackByAndViewByAttributes,
            config: {
                ...defaultProps.config,
                colors: customColors
            }
        };
        mount(createComponent(componentProps));
        expect(colorPalette).toEqual(customColors);
    });

    describe('Stacking config', () => {
        const defaultConfig = {
            type: 'area'
        };

        function createChartRendererProps(
            executionData = fixtures.areaChartWith3MetricsAndViewByAttribute,
            config: IChartConfig = {}
        ) {
            const renderer = jest.fn().mockReturnValue(<div />);
            mount(createComponent({
                renderer,
                ...executionData,
                config: {
                    ...config,
                    type: config.type || defaultConfig.type
                }
            }));
            return renderer.mock.calls[0][0];
        }

        it('should be enabled by default for area chart', () => {
            const passedProps = createChartRendererProps(fixtures.areaChartWith3MetricsAndViewByAttribute);
            expect(passedProps.chartOptions.stacking).toEqual('normal');
        });

        it('should be enabled by configuration', () => {
            const passedProps = createChartRendererProps(fixtures.areaChartWith3MetricsAndViewByAttribute, {
                stacking: true
            });
            expect(passedProps.chartOptions.stacking).toEqual('normal');
        });

        it('should be disabled by configuration', () => {
            const passedProps = createChartRendererProps(fixtures.areaChartWith3MetricsAndViewByAttribute, {
                stacking: false
            });
            expect(passedProps.chartOptions.stacking).toBeNull();
        });
    });

    describe('Legend config', () => {
        const defaultConfig = {
            type: 'column',
            legend: {
                enabled: true
            }
        };
        let pushData: any;
        function createChartRendererProps(
            executionData = fixtures.barChartWithStackByAndViewByAttributes,
            config: IChartConfig = {}
        ) {
            const renderer = jest.fn().mockReturnValue(<div />);
            pushData = jest.fn();
            mount(createComponent({
                renderer,
                ...executionData,
                config: {
                    ...config,
                    type: config.type || defaultConfig.type
                },
                pushData
            }));
            return renderer.mock.calls[0][0];
        }

        it('should be always disabled for single series and push this info out', () => {
            const passedProps = createChartRendererProps(fixtures.barChartWithViewByAttribute);
            expect(passedProps.legend.enabled).toEqual(false);
            expect(pushData).toBeCalledWith({
                propertiesMeta: {
                    legend_enabled: false
                }
            });
        });

        it('should be enabled & on the top by default and push this info out', () => {
            const passedProps = createChartRendererProps(fixtures.barChartWith3MetricsAndViewByAttribute);
            expect(passedProps.legend.enabled).toEqual(true);
            expect(passedProps.legend.position).toEqual(TOP);
            expect(pushData).toBeCalledWith({
                propertiesMeta: {
                    legend_enabled: true
                }
            });
        });

        it('should be able to disable default', () => {
            const passedProps = createChartRendererProps(fixtures.barChartWith3MetricsAndViewByAttribute, {
                legend: {
                    enabled: false
                }
            });
            expect(passedProps.legend.enabled).toEqual(false);
        });
    });

    describe('onDataTooLarge', () => {
        it('should be invoked if data series is over limit', () => {
            const onDataTooLarge = jest.fn();
            const props = {
                ...fixtures.barChartWith3MetricsAndViewByAttribute,
                onDataTooLarge,
                config: {
                    ...defaultProps.config,
                    limits: {
                        series: 1
                    }
                }
            };
            mount(createComponent(props));
            expect(onDataTooLarge).toHaveBeenCalledTimes(1);
        });

        it('should be invoked if data categories is over limit', () => {
            const onDataTooLarge = jest.fn();
            const props = {
                ...fixtures.barChartWith3MetricsAndViewByAttribute,
                onDataTooLarge,
                config: {
                    ...defaultProps.config,
                    limits: {
                        categories: 1
                    }
                }
            };
            mount(createComponent(props));
            expect(onDataTooLarge).toHaveBeenCalledTimes(1);
        });

        it('should be invoked on component mount', () => {
            const onDataTooLarge = jest.fn();
            const props = {
                ...fixtures.barChartWith3MetricsAndViewByAttribute,
                onDataTooLarge,
                config: {
                    ...defaultProps.config,
                    limits: {
                        series: 1
                    }
                }
            };
            const wrapper = shallow(createComponent(props));
            expect(wrapper.find(HighChartsRenderer)).toHaveLength(0);
            expect(onDataTooLarge).toHaveBeenCalledTimes(1);
        });

        it('should be invoked on props change', () => {
            const onDataTooLarge = jest.fn();
            const props = {
                ...fixtures.barChartWith3MetricsAndViewByAttribute,
                onDataTooLarge,
                config: {
                    ...defaultProps.config,
                    limits: {
                        series: 1
                    }
                }
            };
            const wrapper = shallow(createComponent());
            expect(wrapper.find(HighChartsRenderer)).toHaveLength(1);

            wrapper.setProps(props);
            expect(wrapper.find(HighChartsRenderer)).toHaveLength(0);
            expect(onDataTooLarge).toHaveBeenCalledTimes(1);

            wrapper.setProps({
                ...defaultProps,
                config: {
                    ...defaultProps.config,
                    limits: undefined
                }
            });
            expect(wrapper.find(HighChartsRenderer)).toHaveLength(1);
        });
    });

    describe('onNegativeValues', () => {
        const pieChartPropsWithNegativeValue = {
            ...fixtures.pieChartWithMetricsOnly,
            config: {
                ...defaultProps.config,
                type: 'pie'
            },
            executionResult: {
                ...fixtures.pieChartWithMetricsOnly.executionResult,
                data: [
                    [
                        '-1',
                        '38310753.45',
                        '9011389.956'
                    ]
                ]
            }
        };

        it('should be invoked if pie chart data contains a negative value', () => {
            const onNegativeValues = jest.fn();
            const props = {
                onNegativeValues,
                ...pieChartPropsWithNegativeValue
            };
            mount(createComponent(props));
            expect(onNegativeValues).toHaveBeenCalledTimes(1);
        });

        it('should not be invoke on other than pie charts', () => {
            const onNegativeValues = jest.fn();
            const props = {
                onNegativeValues,
                ...pieChartPropsWithNegativeValue,
                config: {
                    ...defaultProps.config,
                    type: 'column'
                }
            };
            mount(createComponent(props));
            expect(onNegativeValues).toHaveBeenCalledTimes(0);
        });

        it('should not be invoked if data is too large as well', () => {
            const onNegativeValues = jest.fn();
            const props = {
                onNegativeValues,
                ...pieChartPropsWithNegativeValue,
                config: {
                    ...defaultProps.config,
                    type: 'pie',
                    limits: {
                        categories: 1
                    }
                }
            };
            mount(createComponent(props));
            expect(onNegativeValues).toHaveBeenCalledTimes(0);
        });

        it('should be invoked on component mount', () => {
            const onNegativeValues = jest.fn();
            const props = {
                onNegativeValues,
                ...pieChartPropsWithNegativeValue
            };
            const wrapper = shallow(createComponent(props));
            expect(wrapper.find(HighChartsRenderer)).toHaveLength(0);
            expect(onNegativeValues).toHaveBeenCalledTimes(1);
        });

        it('should be invoked on props change', () => {
            const onNegativeValues = jest.fn();
            const props = {
                onNegativeValues,
                ...pieChartPropsWithNegativeValue
            };
            const wrapper = shallow(createComponent());
            expect(wrapper.find(HighChartsRenderer)).toHaveLength(1);

            wrapper.setProps(props);
            expect(wrapper.find(HighChartsRenderer)).toHaveLength(0);
            expect(onNegativeValues).toHaveBeenCalledTimes(1);

            wrapper.setProps(fixtures.pieChartWithMetricsOnly);
            expect(wrapper.find(HighChartsRenderer)).toHaveLength(1);
        });
    });
});
