// (C) 2007-2020 GoodData Corporation
import get = require("lodash/get");
import merge = require("lodash/merge");
import * as invariant from "invariant";
import { getCommonConfiguration } from "./highcharts/commonConfiguration";

import { stringifyChartTypes } from "../utils/common";

import { IChartConfig, IChartLimits, IChartOptions } from "../../../interfaces/Config";

import { getLineConfiguration } from "./highcharts/lineConfiguration";
import { getBarConfiguration } from "./highcharts/barConfiguration";
import { getColumnConfiguration } from "./highcharts/columnConfiguration";
import { getBulletConfiguration } from "./highcharts/bulletConfiguration";
import { getCustomizedConfiguration } from "./highcharts/customConfiguration";
import { getPieConfiguration } from "./highcharts/pieConfiguration";
import { getDonutConfiguration } from "./highcharts/donutConfiguration";
import { getAreaConfiguration } from "./highcharts/areaConfiguration";
import { getScatterConfiguration } from "./highcharts/scatterConfiguration";
import { getComboConfiguration } from "./highcharts/comboConfiguration";
import { getTreemapConfiguration } from "./highcharts/treemapConfiguration";
import { getFunnelConfiguration } from "./highcharts/funnelConfiguration";
import { getHeatmapConfiguration } from "./highcharts/heatmapConfiguration";
import { getBubbleConfiguration } from "./highcharts/bubbleConfiguration";
import { VisualizationTypes } from "../../../constants/visualizationTypes";
import { IDrillConfig } from "../../../interfaces/DrillEvents";

const chartConfigurationMap = {
    [VisualizationTypes.LINE]: getLineConfiguration,
    [VisualizationTypes.BAR]: getBarConfiguration,
    [VisualizationTypes.COLUMN]: getColumnConfiguration,
    [VisualizationTypes.BULLET]: getBulletConfiguration,
    [VisualizationTypes.PIE]: getPieConfiguration,
    [VisualizationTypes.AREA]: getAreaConfiguration,
    [VisualizationTypes.SCATTER]: getScatterConfiguration,
    [VisualizationTypes.COMBO]: getComboConfiguration,
    [VisualizationTypes.COMBO2]: getComboConfiguration,
    [VisualizationTypes.TREEMAP]: getTreemapConfiguration,
    [VisualizationTypes.DONUT]: getDonutConfiguration,
    [VisualizationTypes.FUNNEL]: getFunnelConfiguration,
    [VisualizationTypes.HEATMAP]: getHeatmapConfiguration,
    [VisualizationTypes.BUBBLE]: getBubbleConfiguration,
};

export function getHighchartsOptions(
    chartOptions: IChartOptions,
    drillConfig: IDrillConfig,
    config?: IChartConfig,
) {
    const getConfigurationByType = chartConfigurationMap[chartOptions.type];
    invariant(
        getConfigurationByType,
        `visualisation type ${chartOptions.type} is invalid (valid types: ${stringifyChartTypes()}).`,
    );
    return merge(
        {},
        getCommonConfiguration(chartOptions, drillConfig),
        getConfigurationByType.call(null, config),
        getCustomizedConfiguration(chartOptions, config, drillConfig),
    );
}

export function isDataOfReasonableSize(chartData: any, limits: IChartLimits, isViewByTwoAttributes = false) {
    let result = true;

    const seriesLimit = get(limits, "series");
    if (seriesLimit !== undefined) {
        result = result && chartData.series.length <= seriesLimit;
    }

    const categoriesLimit = get(limits, "categories");
    if (categoriesLimit !== undefined) {
        if (isViewByTwoAttributes) {
            const categoriesLength = chartData.categories.reduce((result: number, category: any) => {
                return result + category.categories.length;
            }, 0);
            result = result && categoriesLength <= categoriesLimit;
        } else {
            result = result && chartData.categories.length <= categoriesLimit;
        }
    }

    const dataPointsLimit = get(limits, "dataPoints");
    if (dataPointsLimit !== undefined) {
        result = result && chartData.series.every((serie: any) => serie.data.length <= dataPointsLimit);
    }

    return result;
}
