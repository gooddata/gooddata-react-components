// (C) 2007-2018 GoodData Corporation
import * as cx from 'classnames';
import noop = require('lodash/noop');
import set = require('lodash/set');
import get = require('lodash/get');
import merge = require('lodash/merge');
import map = require('lodash/map');
import partial = require('lodash/partial');
import isEmpty = require('lodash/isEmpty');
import compact = require('lodash/compact');
import cloneDeep = require('lodash/cloneDeep');
import every = require('lodash/every');
import isNil = require('lodash/isNil');
import { styleVariables } from '../../styles/variables';
import { IAxis, IChartOptions } from '../chartOptionsBuilder';
import { IChartConfig } from '../Chart';

import * as numberJS from '@gooddata/numberjs';
import { VisualizationTypes } from '../../../../constants/visualizationTypes';
import { IDataLabelsVisibile } from '../../../../interfaces/Config';
import { HOVER_BRIGHTNESS, MINIMUM_HC_SAFE_BRIGHTNESS } from './commonConfiguration';
import { getLighterColor } from '../../utils/color';
import {
    isBarChart,
    isColumnChart,
    isOneOfTypes,
    isAreaChart,
    isRotationInRange,
    isTreemap,
    isHeatmap,
    isScatterPlot,
    isBubbleChart
} from '../../utils/common';
import { shouldFollowPointer } from '../../../visualizations/chart/highcharts/helpers';

const {
    stripColors,
    numberFormat
}: any = numberJS;

const EMPTY_DATA: any = { categories: [], series: [] };

const ALIGN_LEFT = 'left';
const ALIGN_RIGHT = 'right';
const ALIGN_CENTER = 'center';

const TOOLTIP_ARROW_OFFSET = 23;
const TOOLTIP_FULLSCREEN_THRESHOLD = 480;
const TOOLTIP_MAX_WIDTH = 366;
const TOOLTIP_BAR_CHART_VERTICAL_OFFSET = 5;
const TOOLTIP_VERTICAL_OFFSET = 14;

const escapeAngleBrackets = (str: any) => str && str.replace(/</g, '&lt;').replace(/>/g, '&gt;');

function getTitleConfiguration(chartOptions: any) {
    const { yAxes = [], xAxes = [] }: { yAxes: IAxis[], xAxes: IAxis[] } = chartOptions;
    const yAxis = yAxes.map((axis: IAxis) => (axis ? {
        title: {
            text: escapeAngleBrackets(get(axis, 'label', ''))
        }
    } : {}));

    const xAxis = xAxes.map((axis: IAxis) => (axis ? {
        title: {
            text: escapeAngleBrackets(get(axis, 'label', ''))
        }
    } : {}));

    return {
        yAxis,
        xAxis
    };
}

function formatAsPercent() {
    const val = parseFloat((this.value * 100).toPrecision(14));
    return `${val}%`;
}

function isInPercent(format: string = '') {
    return format.includes('%');
}

function formatOverlapping() {
    const chartHeight = get(this, 'chart.chartHeight', 1);
    const categoriesCount = get(this, 'axis.categories', []).length;
    const width = Math.floor(chartHeight / categoriesCount);
    const pixelOffset = 20;

    const finalWidth = Math.max(0, width - pixelOffset);

    return (
        `<div align="center" style="width: ${finalWidth}px; overflow: hidden; text-overflow: ellipsis">`
        + this.value + '</div>'
    );
}

function hideOverlappedLabels(chartOptions: any) {
    const rotation = Number(get(chartOptions, 'xAxisProps.rotation', '0'));

    // Set only for bar chart and labels are rotated by 90
    if (isBarChart(chartOptions.type) && isRotationInRange(rotation, 75, 105)) {
        const { xAxes = [] }: { xAxes: IAxis[]} = chartOptions;

        return {
            xAxis: xAxes.map(axis => (axis) ? {
                labels: {
                    useHTML: true,
                    formatter: formatOverlapping
                }
            } : {})
        };
    }

    return {};
}

function getShowInPercentConfiguration(chartOptions: any) {
    const { yAxes = [], xAxes = [] }: { yAxes: IAxis[], xAxes: IAxis[] } = chartOptions;

    const xAxis = xAxes.map(axis => (axis && isInPercent(axis.format) ? {
        labels: {
            formatter: formatAsPercent
        }
    } : {}));

    const yAxis = yAxes.map(axis => (axis && isInPercent(axis.format) ? {
        labels: {
            formatter: formatAsPercent
        }
    } : {}));

    return {
        xAxis,
        yAxis
    };
}

function getArrowAlignment(arrowPosition: any, chartWidth: any) {
    const minX = -TOOLTIP_ARROW_OFFSET;
    const maxX = chartWidth + TOOLTIP_ARROW_OFFSET;

    if (
        arrowPosition + (TOOLTIP_MAX_WIDTH / 2) > maxX &&
        arrowPosition - (TOOLTIP_MAX_WIDTH / 2) > minX
    ) {
        return ALIGN_RIGHT;
    }

    if (
        arrowPosition - (TOOLTIP_MAX_WIDTH / 2) < minX &&
        arrowPosition + (TOOLTIP_MAX_WIDTH / 2) < maxX
    ) {
        return ALIGN_LEFT;
    }

    return ALIGN_CENTER;
}

const getTooltipHorizontalStartingPosition = (arrowPosition: any, chartWidth: any, tooltipWidth: any) => {
    switch (getArrowAlignment(arrowPosition, chartWidth)) {
        case ALIGN_RIGHT:
            return (arrowPosition - tooltipWidth) + TOOLTIP_ARROW_OFFSET;
        case ALIGN_LEFT:
            return arrowPosition - TOOLTIP_ARROW_OFFSET;
        default:
            return arrowPosition - (tooltipWidth / 2);
    }
};

function getArrowHorizontalPosition(chartType: any, stacking: any, dataPointEnd: any, dataPointHeight: any) {
    if (isBarChart(chartType) && stacking) {
        return dataPointEnd - (dataPointHeight / 2);
    }

    return dataPointEnd;
}

function getDataPointEnd(chartType: any, isNegative: any, endPoint: any, height: any, stacking: any) {
    return (isBarChart(chartType) && isNegative && stacking) ? endPoint + height : endPoint;
}

function getDataPointStart(chartType: any, isNegative: any, endPoint: any, height: any, stacking: any) {
    return (isColumnChart(chartType) && isNegative && stacking) ? endPoint - height : endPoint;
}

function getTooltipVerticalOffset(chartType: any, stacking: any, point: any) {
    if (isColumnChart(chartType) && (stacking || point.negative)) {
        return 0;
    }

    if (isBarChart(chartType)) {
        return TOOLTIP_BAR_CHART_VERTICAL_OFFSET;
    }

    return TOOLTIP_VERTICAL_OFFSET;
}

function positionTooltip(chartType: any, stacking: any, labelWidth: any, labelHeight: any, point: any) {
    const dataPointEnd = getDataPointEnd(chartType, point.negative, point.plotX, point.h, stacking);
    const arrowPosition = getArrowHorizontalPosition(chartType, stacking, dataPointEnd, point.h);
    const chartWidth = this.chart.plotWidth;

    const tooltipHorizontalStartingPosition = getTooltipHorizontalStartingPosition(
        arrowPosition,
        chartWidth,
        labelWidth
    );

    const verticalOffset = getTooltipVerticalOffset(chartType, stacking, point);

    const dataPointStart = getDataPointStart(
        chartType,
        point.negative,
        point.plotY,
        point.h,
        stacking
    );

    return {
        x: this.chart.plotLeft + tooltipHorizontalStartingPosition,
        y: (this.chart.plotTop + dataPointStart) - (labelHeight + verticalOffset)
    };
}

const showFullscreenTooltip = () => {
    return document.documentElement.clientWidth <= TOOLTIP_FULLSCREEN_THRESHOLD;
};

function isPointBasedChart(chartType: string) {
    const pointBasedTypes = [
        VisualizationTypes.LINE,
        VisualizationTypes.AREA,
        VisualizationTypes.TREEMAP,
        VisualizationTypes.DUAL,
        VisualizationTypes.SCATTER
    ];
    return isOneOfTypes(chartType, pointBasedTypes);
}

function formatTooltip(chartType: any, stacking: any, tooltipCallback: any) {
    const { chart } = this.series;
    const { color: pointColor } = this.point;

    // when brushing, do not show tooltip
    if (chart.mouseIsDown) {
        return false;
    }

    const dataPointEnd = (
        isPointBasedChart(chartType) ||
        !this.point.tooltipPos
    )
        ? this.point.plotX
        : getDataPointEnd(
            chartType,
            this.point.negative,
            this.point.tooltipPos[0],
            this.point.tooltipPos[2],
            stacking
        );

    const ignorePointHeight =
        isPointBasedChart(chartType) ||
        !this.point.shapeArgs;

    const dataPointHeight = ignorePointHeight ? 0 : this.point.shapeArgs.height;

    const arrowPosition = getArrowHorizontalPosition(
        chartType,
        stacking,
        dataPointEnd,
        dataPointHeight
    );

    const chartWidth = chart.plotWidth;
    const align = getArrowAlignment(arrowPosition, chartWidth);
    const arrowPositionForTail = arrowPosition > chartWidth ? chartWidth / 2 : arrowPosition;

    const strokeStyle = pointColor ? `border-top-color: ${pointColor};` : '';
    const tailStyle = showFullscreenTooltip() ?
        `style="left: ${arrowPositionForTail + chart.plotLeft}px;"` : '';

    const getTailClasses = (classname: any) => {
        return cx(classname, {
            [align]: !showFullscreenTooltip()
        });
    };

    const tooltipContent = tooltipCallback(this.point); // null disables whole tooltip

    return tooltipContent !== null ? (
        `<div class="hc-tooltip">
            <span class="stroke" style="${strokeStyle}"></span>
            <div class="content">
                ${tooltipContent}
            </div>
            <div class="${getTailClasses('tail1')}" ${tailStyle}></div>
            <div class="${getTailClasses('tail2')}" ${tailStyle}></div>
        </div>`
    ) : null;
}

function formatLabel(value: any, format: any, config: IChartConfig = {}) {
    // no labels for missing values
    if (value === null) {
        return null;
    }

    const stripped = stripColors(format || '');
    const { separators } = config;
    return escapeAngleBrackets(String(numberFormat(value, stripped, undefined, separators)));
}

function labelFormatter(config?: IChartConfig) {
    return formatLabel(this.y, get(this, 'point.format'), config);
}

function labelFormatterHeatmap(options: any) {
    return formatLabel(this.point.value, options.formatGD, options.config);
}

function level1LabelsFormatter(config?: IChartConfig) {
    return `${get(this, 'point.name')} (${formatLabel(get(this, 'point.node.val'),
                                                        get(this, 'point.format'),
                                                        config)})`;
}
function level2LabelsFormatter(config?: IChartConfig) {
    return `${get(this, 'point.name')} (${formatLabel(get(this, 'point.value'), get(this, 'point.format'), config)})`;
}

function labelFormatterBubble(config?: IChartConfig) {
    const value = get<number>(this, 'point.z');
    if (isNil(value) || isNaN(value)) {
        return null;
    }

    const xAxisMin = get(this, 'series.xAxis.min');
    const xAxisMax = get(this, 'series.xAxis.max');
    const yAxisMin = get(this, 'series.yAxis.min');
    const yAxisMax = get(this, 'series.yAxis.max');

    if (
        (!isNil(xAxisMax) && this.x > xAxisMax) ||
        (!isNil(xAxisMin) && this.x < xAxisMin) ||
        (!isNil(yAxisMax) && this.y > yAxisMax) ||
        (!isNil(yAxisMin) && this.y < yAxisMin)
    ) {
        return null;
    } else {
        return formatLabel(value, get(this, 'point.format'), config);
    }
}

function labelFormatterScatter() {
    const name = get(this, 'point.name');
    if (name) {
        return escapeAngleBrackets(name);
    }
    return null;
}

// check whether series contains only positive values, not consider nulls
function hasOnlyPositiveValues(series: any, x: any) {
    return every(series, (seriesItem: any) => {
        const dataPoint = seriesItem.yData[x];
        return dataPoint !== null && dataPoint >= 0;
    });
}

function stackLabelFormatter(config?: IChartConfig) {
    // show labels: always for negative,
    // without negative values or with non-zero total for positive
    const showStackLabel =
        this.isNegative || hasOnlyPositiveValues(this.axis.series, this.x) || this.total !== 0;
    return showStackLabel ?
        formatLabel(this.total, get(this, 'axis.userOptions.defaultFormat'), config) : null;
}

function getTooltipConfiguration(chartOptions: IChartOptions) {
    const tooltipAction = get(chartOptions, 'actions.tooltip');
    const chartType = chartOptions.type;
    const { stacking } = chartOptions;

    const followPointer = isOneOfTypes(chartType, [VisualizationTypes.COLUMN, VisualizationTypes.BAR])
        ? { followPointer: shouldFollowPointer(chartOptions) }
        : {};

    return tooltipAction ? {
        tooltip: {
            borderWidth: 0,
            borderRadius: 0,
            shadow: false,
            useHTML: true,
            positioner: partial(positionTooltip, chartType, stacking),
            formatter: partial(formatTooltip, chartType, stacking, tooltipAction),
            ...followPointer
        }
    } : {};
}

function getTreemapLabelsConfiguration(
    isMultiLevel: boolean, style: any, config?: IChartConfig, labelsConfig?: object
) {
    const smallLabelInCenter = {
        dataLabels: {
            enabled: true,
            padding: 2,
            formatter: partial(level2LabelsFormatter, config),
            allowOverlap: false,
            style,
            ...labelsConfig
        }
    };
    if (isMultiLevel) {
        return {
            dataLabels: {
                ...labelsConfig
            },
            levels: [{
                level: 1,
                dataLabels: {
                    enabled: true,
                    align: 'left',
                    verticalAlign: 'top',
                    padding: 5,
                    style: {
                        ...style,
                        fontSize: '14px'
                    },
                    formatter: partial(level1LabelsFormatter, config),
                    allowOverlap: false,
                    ...labelsConfig
                }
            }, {
                level: 2,
                ...smallLabelInCenter
            }]
        };
    } else {
        return {
            dataLabels: {
                ...labelsConfig
            },
            levels: [{
                level: 1,
                ...smallLabelInCenter
            }]
        };
    }
}

function getLabelsVisibilityConfig(visible: IDataLabelsVisibile): any {
    switch (visible) {
        case 'auto':
            return {
                enabled: true,
                allowOverlap: false
            };
        case true:
            return {
                enabled: true,
                allowOverlap: true
            };
        case false:
            return {
                enabled: false
            };
        default: // keep decision on each chart for `undefined`
            return {};
    }
}

// types with label inside sections have white labels
const whiteDataLabelTypes = [
    VisualizationTypes.PIE,
    VisualizationTypes.DONUT,
    VisualizationTypes.TREEMAP,
    VisualizationTypes.BUBBLE
];

function getLabelStyle(chartOptions: any) {
    const {
        stacking,
        type
    }: {
        stacking: boolean;
        type: string;
    } = chartOptions;

    const WHITE_LABEL = {
        color: '#ffffff',
        textShadow: '0 0 1px #000000'
    };

    const BLACK_LABEL = {
        color: '#000000',
        textShadow: 'none'
    };

    if (isAreaChart(type)) {
        return BLACK_LABEL;
    }
    return (stacking || isOneOfTypes(type, whiteDataLabelTypes)) ? WHITE_LABEL : BLACK_LABEL;
}

function getLabelsConfiguration(chartOptions: any, _config: any, chartConfig?: IChartConfig) {
    const {
        stacking,
        yAxes = [],
        type
    }: {
        stacking: boolean;
        yAxes: IAxis[];
        type: string;
    } = chartOptions;

    const labelsVisible: IDataLabelsVisibile = get<IDataLabelsVisibile>(chartConfig, 'dataLabels.visible');

    const labelsConfig = getLabelsVisibilityConfig(labelsVisible);

    const style = getLabelStyle(chartOptions);

    const drilldown = stacking || isTreemap(type) ? {
        activeDataLabelStyle: {
            color: '#ffffff'
        }
    } : {};

    const yAxis = yAxes.map((axis: any) => ({
        defaultFormat: get(axis, 'format')
    }));

    const DEFAULT_LABELS_CONFIG = {
        formatter: partial(labelFormatter, chartConfig),
        style,
        allowOverlap: false,
        ...labelsConfig
    };

    return {
        drilldown,
        plotOptions: {
            gdcOptions: {
                dataLabels: {
                    visible: labelsVisible
                }
            },
            bar: {
                dataLabels: DEFAULT_LABELS_CONFIG
            },
            column: {
                dataLabels: {
                    formatter: partial(labelFormatter, chartConfig),
                    style,
                    allowOverlap: false,
                    ...labelsConfig
                }
            },
            heatmap: {
                dataLabels: {
                    formatter: labelFormatterHeatmap,
                    config: chartConfig,
                    ...labelsConfig
                }
            },
            treemap: {
                ...getTreemapLabelsConfiguration(!!stacking, style, chartConfig, labelsConfig)
            },
            line: {
                dataLabels: DEFAULT_LABELS_CONFIG
            },
            area: {
                dataLabels: DEFAULT_LABELS_CONFIG
            },
            scatter: {
                dataLabels: {
                    ...DEFAULT_LABELS_CONFIG,
                    formatter: partial(labelFormatterScatter, chartConfig)
                }
            },
            bubble: {
                dataLabels: {
                    ...DEFAULT_LABELS_CONFIG,
                    formatter: partial(labelFormatterBubble, chartConfig)
                }
            },
            pie: {
                dataLabels: {
                    ...DEFAULT_LABELS_CONFIG,
                    verticalAlign: 'middle'
                }
            }
        },
        yAxis
    };
}

function getStackingConfiguration(chartOptions: any, _config: any, chartConfig?: IChartConfig) {
    const { stacking, yAxes = [], type }: { stacking: boolean, yAxes: IAxis[], type: any } = chartOptions;
    let labelsConfig = {};

    if (isColumnChart(type)) {
        const labelsVisible: IDataLabelsVisibile = get<IDataLabelsVisibile>(chartConfig, 'dataLabels.visible');
        labelsConfig = getLabelsVisibilityConfig(labelsVisible);
    }

    const yAxis = yAxes.map(() => ({
        stackLabels: {
            ...labelsConfig,
            formatter: partial(stackLabelFormatter, chartConfig)
        }
    }));

    let connectNulls = {};
    if (stacking && isAreaChart(type)) {
        connectNulls = {
            connectNulls: true
        };
    }

    return stacking ? {
        plotOptions: {
            series: {
                stacking,
                ...connectNulls
            }
        },
        yAxis
    } : {};
}

function getSeries(series: any) {
    return series.map((seriesItem: any) => {
        const item = cloneDeep(seriesItem);
        // Escaping is handled by highcharts so we don't want to provide escaped input.
        // With one exception, though. Highcharts supports defining styles via
        // for example <b>...</b> and parses that from series name.
        // So to avoid this parsing, escape only < and > to &lt; and &gt;
        // which is understood by highcharts correctly
        item.name = item.name && escapeAngleBrackets(item.name);

        // Escape data items for pie chart
        item.data = item.data.map((dataItem: any) => {
            if (!dataItem) {
                return dataItem;
            }

            return {
                ...dataItem,
                name: escapeAngleBrackets(dataItem.name)
            };
        });

        return item;
    });
}

function getHeatmapDataConfiguration(chartOptions: any) {
    const data = chartOptions.data || EMPTY_DATA;
    const series = data.series;
    const categories = data.categories;

    return {
        series,
        xAxis: [{
            categories: categories[0] || []
        }],
        yAxis: [{
            categories: categories[1] || []
        }],
        colorAxis: {
            dataClasses: get(chartOptions, 'colorAxis.dataClasses', [])
        }
    };
}

function getDataConfiguration(chartOptions: any) {
    const data = chartOptions.data || EMPTY_DATA;
    const series = getSeries(data.series);
    const { type } = chartOptions;

    switch (type) {
        case VisualizationTypes.SCATTER:
        case VisualizationTypes.BUBBLE:
            return {
                series
            };
        case VisualizationTypes.HEATMAP:
            return getHeatmapDataConfiguration(chartOptions);
    }

    const categories = map(data.categories, escapeAngleBrackets);

    return {
        series,
        xAxis: [{
            categories
        }]
    };
}

function lineSeriesMapFn(seriesOrig: any) {
    const series = cloneDeep(seriesOrig);

    if (series.isDrillable) {
        set(series, 'marker.states.hover.fillColor', getLighterColor(series.color, HOVER_BRIGHTNESS));
        set(series, 'cursor', 'pointer');
    } else {
        set(series, 'states.hover.halo.size', 0);
    }

    return series;
}

function barSeriesMapFn(seriesOrig: any) {
    const series = cloneDeep(seriesOrig);

    set(series, 'states.hover.brightness', HOVER_BRIGHTNESS);
    set(series, 'states.hover.enabled', series.isDrillable);

    return series;
}

function getHoverStyles({ type }: any, config: any) {
    let seriesMapFn = noop;

    switch (type) {
        default:
            throw new Error(`Undefined chart type "${type}".`);

        case VisualizationTypes.DUAL:
        case VisualizationTypes.LINE:
        case VisualizationTypes.SCATTER:
        case VisualizationTypes.AREA:
        case VisualizationTypes.BUBBLE:
            seriesMapFn = lineSeriesMapFn;
            break;

        case VisualizationTypes.BAR:
        case VisualizationTypes.COLUMN:
        case VisualizationTypes.FUNNEL:
        case VisualizationTypes.HEATMAP:
            seriesMapFn = barSeriesMapFn;
            break;

        case VisualizationTypes.COMBO:
            seriesMapFn = (seriesOrig) => {
                const { type } = seriesOrig;

                if (type === 'line') {
                    return lineSeriesMapFn(seriesOrig);
                }
                return barSeriesMapFn(seriesOrig);
            };
            break;

        case VisualizationTypes.PIE:
        case VisualizationTypes.DONUT:
        case VisualizationTypes.TREEMAP:
            seriesMapFn = (seriesOrig) => {
                const series = cloneDeep(seriesOrig);

                return {
                    ...series,
                    data: series.data.map((dataItemOrig: any) => {
                        const dataItem = cloneDeep(dataItemOrig);
                        const drilldown = get(dataItem, 'drilldown');

                        set(dataItem, 'states.hover.brightness', drilldown ?
                            HOVER_BRIGHTNESS : MINIMUM_HC_SAFE_BRIGHTNESS);

                        if (!drilldown) {
                            set(dataItem, 'halo.size', 0); // see plugins/pointHalo.js
                        }

                        return dataItem;
                    })
                };
            };
            break;
    }

    return {
        series: config.series.map(seriesMapFn)
    };
}

function getGridConfiguration(chartOptions: any) {
    const gridEnabled = get(chartOptions, 'grid.enabled', true);
    const { yAxes = [], xAxes = [] }: { yAxes: IAxis[], xAxes: IAxis[] } = chartOptions;

    const config = gridEnabled ? { gridLineWidth: 1, gridLineColor: '#ebebeb' } : { gridLineWidth: 0 };

    const yAxis = yAxes.map(() => config);

    const bothAxesGridlineCharts = [VisualizationTypes.BUBBLE, VisualizationTypes.SCATTER];
    let xAxis = {};
    if (isOneOfTypes(chartOptions.type, bothAxesGridlineCharts)) {
        xAxis = xAxes.map(() => config);
    }

    return {
        yAxis,
        xAxis
    };
}

export function areAxisLabelsEnabled(chartOptions: any, axisPropsName: string, shouldCheckForEmptyCategories: boolean) {
    const data = chartOptions.data || EMPTY_DATA;
    const { type } = chartOptions;
    const categories = isHeatmap(type) ? data.categories : map(data.categories, escapeAngleBrackets);

    const visible = get(chartOptions, `${axisPropsName}.visible`, true);
    const labelsEnabled = get(chartOptions, `${axisPropsName}.labelsEnabled`, true);

    const categoriesFlag = shouldCheckForEmptyCategories ? !isEmpty(compact(categories)) : true;

    return {
        enabled: categoriesFlag && visible && labelsEnabled
    };
}

function shouldExpandYAxis(chartOptions: any) {
    const min = get(chartOptions, 'xAxisProps.min', '');
    const max = get(chartOptions, 'xAxisProps.max', '');
    return min === '' && max === '' ? {} : { getExtremesFromAll: true };
}

function isAxisLineVisible(isAxisVisible: boolean, isGridEnabled: boolean) {
    return isAxisVisible && !isGridEnabled;
}

function getAxesConfiguration(chartOptions: any) {
    const { type } = chartOptions;
    const gridEnabled = get(chartOptions, 'grid.enabled', true);

    return {
        plotOptions: {
            series: {
                ...shouldExpandYAxis(chartOptions)
            }
        },
        yAxis: get(chartOptions, 'yAxes', []).map((axis: any) => {
            if (!axis) {
                return {
                    visible: false
                };
            }

            // For bar chart take x axis options
            const min = get(chartOptions, 'yAxisProps.min', '');
            const max = get(chartOptions, 'yAxisProps.max', '');
            const visible = get(chartOptions, 'yAxisProps.visible', true);

            const maxProp = max ? { max: Number(max) } : {};
            const minProp = min ? { min: Number(min) } : {};

            const rotation = get(chartOptions, 'yAxisProps.rotation', 'auto');
            const rotationProp = rotation !== 'auto' ? { rotation: -Number(rotation) } : {};

            const shouldCheckForEmptyCategories = isHeatmap(type) ? true : false;
            const labelsEnabled = areAxisLabelsEnabled(chartOptions, 'yAxisProps', shouldCheckForEmptyCategories);

            return {
                lineWidth: isAxisLineVisible(visible, gridEnabled) ? 1 : 0,
                labels: {
                    ...labelsEnabled,
                    style: {
                        color: styleVariables.gdColorStateBlank,
                        font: '12px Avenir, "Helvetica Neue", Arial, sans-serif'
                    },
                    ...rotationProp
                },
                title: {
                    enabled: visible,
                    margin: 15,
                    style: {
                        color: styleVariables.gdColorLink,
                        font: '14px Avenir, "Helvetica Neue", Arial, sans-serif'
                    }
                },
                opposite: axis.opposite,
                ...maxProp,
                ...minProp
            };
        }),

        xAxis: get(chartOptions, 'xAxes', []).map((axis: any) => {
            if (!axis) {
                return {
                    visible: false
                };
            }

            const min = get(chartOptions, 'xAxisProps.min', '');
            const max = get(chartOptions, 'xAxisProps.max', '');

            const maxProp = max ? { max: Number(max) } : {};
            const minProp = min ? { min: Number(min) } : {};

            const visible = get(chartOptions, 'xAxisProps.visible', true);
            const rotation = get(chartOptions, 'xAxisProps.rotation', 'auto');
            const rotationProp = rotation !== 'auto' ? { rotation: -Number(rotation) } : {};

            const shouldCheckForEmptyCategories = (isScatterPlot(type) || isBubbleChart(type)) ? false : true;
            const labelsEnabled = areAxisLabelsEnabled(chartOptions, 'xAxisProps', shouldCheckForEmptyCategories);

            // for bar chart take y axis options
            return {
                lineColor: '#d5d5d5',
                lineWidth: isAxisLineVisible(visible, gridEnabled) ? 1 : 0,

                // hide ticks on x axis
                minorTickLength: 0,
                tickLength: 0,

                // padding of maximum value
                maxPadding: 0.05,

                labels: {
                    ...labelsEnabled,
                    style: {
                        color: styleVariables.gdColorStateBlank,
                        font: '12px Avenir, "Helvetica Neue", Arial, sans-serif'
                    },
                    autoRotation: [-90],
                    ...rotationProp
                },
                title: {
                    enabled: visible,
                    margin: 10,
                    style: {
                        color: styleVariables.gdColorLink,
                        font: '14px Avenir, "Helvetica Neue", Arial, sans-serif'
                    }
                },
                ...maxProp,
                ...minProp
            };
        })
    };
}

export function getCustomizedConfiguration(chartOptions: IChartOptions, chartConfig?: IChartConfig) {
    const configurators = [
        getAxesConfiguration,
        getTitleConfiguration,
        getStackingConfiguration,
        hideOverlappedLabels,
        getShowInPercentConfiguration,
        getDataConfiguration,
        getTooltipConfiguration,
        getHoverStyles,
        getGridConfiguration,
        getLabelsConfiguration
    ];

    const commonData = configurators.reduce((config: any, configurator: any) => {
        return merge(config, configurator(chartOptions, config, chartConfig));
    }, {});

    return merge({}, commonData);
}
