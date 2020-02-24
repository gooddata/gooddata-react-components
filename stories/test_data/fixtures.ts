// (C) 2007-2020 GoodData Corporation
import { range, cloneDeep } from "lodash";
import { VisualizationObject } from "@gooddata/typings";

import { immutableSet, repeatItemsNTimes } from "../../src/components/visualizations/utils/common";
import { STACK_BY_DIMENSION_INDEX } from "../../src/components/visualizations/chart/constants";

export const barChartWithSingleMeasureAndNoAttributes: any = {
    executionRequest: require("../test_data/bar_chart_with_single_measure_and_no_attributes_request.js")(
        "storybook",
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_single_measure_and_no_attributes_response.js")(
        "storybook",
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_single_measure_and_no_attributes_result.js")(
        "storybook",
    ).executionResult,
};

export const barChartWithoutAttributes: any = {
    executionRequest: require("../test_data/bar_chart_without_attributes_request.js")("storybook").execution,
    executionResponse: require("../test_data/bar_chart_without_attributes_response.js")("storybook")
        .executionResponse,
    executionResult: require("../test_data/bar_chart_without_attributes_result.js")("storybook")
        .executionResult,
};

export const barChartWithNegativeAndZeroValues: any = immutableSet(
    barChartWithoutAttributes,
    "executionResult.data",
    [["-116625456.54"], ["0"]],
);

export const barChartWith3MetricsAndViewByAttribute: any = {
    executionRequest: require("../test_data/bar_chart_with_3_metrics_and_view_by_attribute_request.js")(
        "d20eyb3wfs0xe5l0lfscdnrnyhq1t42q",
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_3_metrics_and_view_by_attribute_response.js")(
        "d20eyb3wfs0xe5l0lfscdnrnyhq1t42q",
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_3_metrics_and_view_by_attribute_result.js")(
        "d20eyb3wfs0xe5l0lfscdnrnyhq1t42q",
    ).executionResult,
};

export const barChartWith2MetricsAndViewByAttribute: any = {
    executionRequest: require("../test_data/bar_chart_with_2_metrics_and_view_by_attribute_request.js")(
        "storybook",
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_2_metrics_and_view_by_attribute_response.js")(
        "storybook",
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_2_metrics_and_view_by_attribute_result.js")(
        "storybook",
    ).executionResult,
};

export const barChartWith4MetricsAndViewBy2Attribute: any = {
    executionRequest: require("../test_data/bar_chart_with_4_metrics_and_view_by_two_attributes_request.js")(
        "storybook",
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_4_metrics_and_view_by_two_attributes_response.js")(
        "storybook",
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_4_metrics_and_view_by_two_attributes_result.js")(
        "storybook",
    ).executionResult,
};

export const barChartWith4MetricsAndViewBy2AttributeAndSomeNullDataPoint: any = {
    executionRequest: require("../test_data/bar_chart_with_4_metrics_and_view_by_two_attributes_request.js")(
        "storybook",
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_4_metrics_and_view_by_two_attributes_response.js")(
        "storybook",
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_4_metrics_and_view_by_two_attributes_with_some_null_datapoints_result.js")(
        "storybook",
    ).executionResult,
};

export const chartWithTwoAttributesAndSomeNullDatapoints: any = {
    executionRequest: require("../test_data/chart_with_2_attributes_and_null_datapoints_request.js")(
        "storybook",
    ).execution,
    executionResponse: require("../test_data/chart_with_2_attributes_and_null_datapoints_response.js")(
        "storybook",
    ).executionResponse,
    executionResult: require("../test_data/chart_with_2_attributes_and_null_datapoints_result.js")(
        "storybook",
    ).executionResult,
};

export const scatterPlotWith2MetricsAndAttribute: any = {
    executionRequest: require("../test_data/scatter_plot_with_2_metrics_and_attribute_request.js")(
        "storybook",
    ).execution,
    executionResponse: require("../test_data/scatter_plot_with_2_metrics_and_attribute_response.js")(
        "storybook",
    ).executionResponse,
    executionResult: require("../test_data/scatter_plot_with_2_metrics_and_attribute_result.js")("storybook")
        .executionResult,
    mdObject: require("../test_data/scatter_plot_with_2_metrics_and_attribute_md.js")("storybook"),
};

export const scatterWithNulls = {
    ...scatterPlotWith2MetricsAndAttribute,
    executionResult: require("../test_data/scatter_plot_with_nulls_result.js")("storybook").executionResult,
};

export const bubbleChartWith3MetricsAndAttributeMd: any = {
    mdObject: require("../test_data/bubble_chart_with_3_metrics_and_attribute_md.js")("storybook"),
};

export const bubbleChartWith3MetricsAndAttribute: any = {
    executionRequest: require("../test_data/bubble_chart_with_3_metrics_and_attribute_request.js")(
        "hzyl5wlh8rnu0ixmbzlaqpzf09ttb7c8",
    ).execution,
    executionResponse: require("../test_data/bubble_chart_with_3_metrics_and_attribute_response.js")(
        "hzyl5wlh8rnu0ixmbzlaqpzf09ttb7c8",
    ).executionResponse,
    executionResult: require("../test_data/bubble_chart_with_3_metrics_and_attribute_result.js")(
        "hzyl5wlh8rnu0ixmbzlaqpzf09ttb7c8",
    ).executionResult,
    ...bubbleChartWith3MetricsAndAttributeMd,
};

export const bubbleChartWith3MetricsMd: any = {
    mdObject: require("../test_data/bubble_chart_with_3_metrics_md.js")("storybook"),
};

export const bubbleChartWith3AMMetricsAndAttribute: any = {
    executionRequest: require("../test_data/bubble_chart_with_3_am_metrics_and_attribute_request.js")(
        "storybook",
    ).execution,
    executionResponse: require("../test_data/bubble_chart_with_3_am_metrics_and_attribute_response.js")(
        "storybook",
    ).executionResponse,
    executionResult: require("../test_data/bubble_chart_with_3_am_metrics_and_attribute_result.js")(
        "storybook",
    ).executionResult,
    mdObject: require("../test_data/bubble_chart_with_3_am_metrics_and_attribute_md.js")("storybook"),
};

export const bubbleChartWith3Metrics: any = {
    executionRequest: require("../test_data/bubble_chart_with_3_metrics_request.js")("storybook").execution,
    executionResponse: require("../test_data/bubble_chart_with_3_metrics_response.js")("storybook")
        .executionResponse,
    executionResult: require("../test_data/bubble_chart_with_3_metrics_result.js")("storybook")
        .executionResult,
    ...bubbleChartWith3MetricsAndAttributeMd,
};

export const bubbleChartWithNulls = {
    ...bubbleChartWith3MetricsAndAttribute,
    ...bubbleChartWith3MetricsAndAttributeMd,
    executionResult: require("../test_data/bubble_chart_with_nulls_result.js")("storybook").executionResult,
};

export const areaChartWith3MetricsAndViewByAttribute: any = {
    executionRequest: require("../test_data/area_chart_with_3_metrics_and_view_by_attribute_request.js")(
        "storybook",
    ).execution,
    executionResponse: require("../test_data/area_chart_with_3_metrics_and_view_by_attribute_response.js")(
        "storybook",
    ).executionResponse,
    executionResult: require("../test_data/area_chart_with_3_metrics_and_view_by_attribute_result.js")(
        "storybook",
    ).executionResult,
};

export const areaChartWith1MetricsAndStackByAttributeAndFilters: any = {
    executionRequest: require("../test_data/area_chart_with_single_metric_and_stack_by_attribute_and_filters_request.js")(
        "storybook",
    ).execution,
    executionResponse: require("../test_data/area_chart_with_single_metric_and_stack_by_attribute_and_filters_response.js")(
        "storybook",
    ).executionResponse,
    executionResult: require("../test_data/area_chart_with_single_metric_and_stack_by_attribute_and_filters_result.js")(
        "storybook",
    ).executionResult,
};

export const areaChartWithNegativeValues: any = {
    executionRequest: require("../test_data/area_chart_with_negative_values_request.js")("storybook")
        .execution,
    executionResponse: require("../test_data/area_chart_with_negative_values_response.js")("storybook")
        .executionResponse,
    executionResult: require("../test_data/area_chart_with_negative_values_result.js")("storybook")
        .executionResult,
};

export const areaChartWithMeasureViewByAndStackBy: any = {
    executionRequest: require("../test_data/area_chart_with_measure_view_by_and_stack_by_request.js")(
        "storybook",
    ).execution,
    executionResponse: require("../test_data/area_chart_with_measure_view_by_and_stack_by_response.js")(
        "storybook",
    ).executionResponse,
    executionResult: require("../test_data/area_chart_with_measure_view_by_and_stack_by_result.js")(
        "storybook",
    ).executionResult,
};

export const barChartWithViewByAttribute: any = {
    executionRequest: require("../test_data/bar_chart_with_view_by_attribute_request.js")(
        "d20eyb3wfs0xe5l0lfscdnrnyhq1t42q",
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_view_by_attribute_response.js")(
        "d20eyb3wfs0xe5l0lfscdnrnyhq1t42q",
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_view_by_attribute_result.js")(
        "d20eyb3wfs0xe5l0lfscdnrnyhq1t42q",
    ).executionResult,
};

export const barChartWithManyViewByAttributeValues: any = {
    executionRequest: require("../test_data/bar_chart_with_many_view_by_attribute_values_request.js")(
        "storybook",
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_many_view_by_attribute_values_response.js")(
        "storybook",
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_many_view_by_attribute_values_result.js")(
        "storybook",
    ).executionResult,
};

export const barChartWithStackByAndViewByAttributes: any = {
    executionRequest: require("../test_data/bar_chart_with_stack_by_and_view_by_attributes_request.js")(
        "d20eyb3wfs0xe5l0lfscdnrnyhq1t42q",
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_stack_by_and_view_by_attributes_response.js")(
        "d20eyb3wfs0xe5l0lfscdnrnyhq1t42q",
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_stack_by_and_view_by_attributes_result.js")(
        "d20eyb3wfs0xe5l0lfscdnrnyhq1t42q",
    ).executionResult,
};

export const barChartWithStackByAndOnlyOneStack: any = {
    executionRequest: require("../test_data/bar_chart_with_stack_by_and_only_one_stack_request.js")(
        "d20eyb3wfs0xe5l0lfscdnrnyhq1t42q",
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_stack_by_and_only_one_stack_response.js")(
        "d20eyb3wfs0xe5l0lfscdnrnyhq1t42q",
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_stack_by_and_only_one_stack_result.js")(
        "d20eyb3wfs0xe5l0lfscdnrnyhq1t42q",
    ).executionResult,
};

export const barChartWithPopMeasureAndViewByAttribute: any = {
    executionRequest: require("../test_data/bar_chart_with_pop_measure_and_view_by_attribute_request.js")(
        "storybook",
    ).execution,
    executionResponse: require("../test_data/bar_chart_with_pop_measure_and_view_by_attribute_response.js")(
        "storybook",
    ).executionResponse,
    executionResult: require("../test_data/bar_chart_with_pop_measure_and_view_by_attribute_result.js")(
        "storybook",
    ).executionResult,
};

export const barChartWithPreviousPeriodMeasure: any = {
    executionRequest: require("../test_data/bar_chart_with_previous_period_measure_request.js")("storybook")
        .execution,
    executionResponse: require("../test_data/bar_chart_with_previous_period_measure_response.js")("storybook")
        .executionResponse,
    executionResult: require("../test_data/bar_chart_with_previous_period_measure_result.js")("storybook")
        .executionResult,
};

export const columnChartWithMeasureViewByAndComputeRatio: any = {
    executionRequest: require("../test_data/column_chart_with_measure_and_view_by_and_computeRatio_request.js")(
        "storybook",
    ).execution,
    executionResponse: require("../test_data/column_chart_with_measure_and_view_by_and_computeRatio_response.js")(
        "storybook",
    ).executionResponse,
    executionResult: require("../test_data/column_chart_with_measure_and_view_by_and_computeRatio_result.js")(
        "storybook",
    ).executionResult,
};

export const columnChartWithMeasureViewBy: any = {
    executionRequest: require("../test_data/column_chart_with_measure_and_view_by_request.js")("storybook")
        .execution,
    executionResponse: require("../test_data/column_chart_with_measure_and_view_by_response.js")("storybook")
        .executionResponse,
    executionResult: require("../test_data/column_chart_with_measure_and_view_by_result.js")("storybook")
        .executionResult,
};

export const columnChartWithMeasureViewBy2AttributesAndComputeRatio: any = {
    executionRequest: require("../test_data/column_chart_with_measure_and_view_by_two_attributes_and_computeRatio_request.js")(
        "storybook",
    ).execution,
    executionResponse: require("../test_data/column_chart_with_measure_and_view_by_two_attributes_and_computeRatio_response.js")(
        "storybook",
    ).executionResponse,
    executionResult: require("../test_data/column_chart_with_measure_and_view_by_two_attributes_and_computeRatio_result.js")(
        "storybook",
    ).executionResult,
};

export const columnChartWithMeasureViewBy2Attributes: any = {
    executionRequest: require("../test_data/column_chart_with_measure_and_view_by_two_attributes_request.js")(
        "storybook",
    ).execution,
    executionResponse: require("../test_data/column_chart_with_measure_and_view_by_two_attributes_response.js")(
        "storybook",
    ).executionResponse,
    executionResult: require("../test_data/column_chart_with_measure_and_view_by_two_attributes_result.js")(
        "storybook",
    ).executionResult,
};

export const pieChartWithMetricsOnly: any = {
    executionRequest: require("../test_data/pie_chart_with_metrics_only_request.js")("storybook").execution,
    executionResponse: require("../test_data/pie_chart_with_metrics_only_response.js")("storybook")
        .executionResponse,
    executionResult: require("../test_data/pie_chart_with_metrics_only_result.js")("storybook")
        .executionResult,
};

export const headlineWithOneMeasure: any = {
    executionRequest: require("../test_data/headline_with_one_measure_request.js")("storybook").execution,
    executionResponse: require("../test_data/headline_with_one_measure_response.js")("storybook")
        .executionResponse,
    executionResult: require("../test_data/headline_with_one_measure_result.js")("storybook").executionResult,
};

export const headlineWithTwoMeasures: any = {
    executionRequest: require("../test_data/headline_with_two_measures_request.js")("storybook").execution,
    executionResponse: require("../test_data/headline_with_two_measures_response.js")("storybook")
        .executionResponse,
    executionResult: require("../test_data/headline_with_two_measures_result.js")("storybook")
        .executionResult,
};

export const pivotTableWithColumnAndRowAttributes: any = {
    executionRequest: require("../test_data/pivot_table_with_column_and_row_attributes_request.js")(
        "xms7ga4tf3g3nzucd8380o2bev8oeknp",
    ).execution,
    executionResponse: require("../test_data/pivot_table_with_column_and_row_attributes_response.js")(
        "xms7ga4tf3g3nzucd8380o2bev8oeknp",
    ).executionResponse,
    executionResult: require("../test_data/pivot_table_with_column_and_row_attributes_result.js")(
        "xms7ga4tf3g3nzucd8380o2bev8oeknp",
    ).executionResult,
};

export const pivotTableWithColumnRowAttributesAndTotals: any = {
    executionRequest: require("../test_data/pivot_table_with_column_row_attributes_and_totals_request.js")(
        "storybook",
    ).execution,
    executionResponse: require("../test_data/pivot_table_with_column_row_attributes_and_totals_response.js")(
        "storybook",
    ).executionResponse,
    executionResult: require("../test_data/pivot_table_with_column_row_attributes_and_totals_result.js")(
        "storybook",
    ).executionResult,
};

export const pivotTableWithSubtotals: any = {
    executionRequest: require("../test_data/pivot_table_with_subtotals_request.js")("storybook").execution,
    executionResponse: require("../test_data/pivot_table_with_subtotals_response.js")("storybook")
        .executionResponse,
    executionResult: require("../test_data/pivot_table_with_subtotals_result.js")("storybook")
        .executionResult,
};

export const comboWithTwoMeasuresAndViewByAttribute = barChartWith2MetricsAndViewByAttribute;
export const comboWithTwoMeasuresAndViewByAttributeMdObject: VisualizationObject.IVisualizationObjectContent = {
    buckets: require("../test_data/combo_chart_with_two_measures_view_by_attribute_md_object.js")("storybook")
        .buckets,
    filters: require("../test_data/combo_chart_with_two_measures_view_by_attribute_md_object.js")("storybook")
        .buckets,
    visualizationClass: require("../test_data/combo_chart_with_two_measures_view_by_attribute_md_object.js")(
        "storybook",
    ).buckets,
};

export const comboWithThreeMeasuresAndViewByAttribute = barChartWith3MetricsAndViewByAttribute;
export const comboWithThreeMeasuresAndViewByAttributeMdObject: VisualizationObject.IVisualizationObjectContent = {
    buckets: require("../test_data/combo_chart_with_three_measures_view_by_attribute_md_object.js")(
        "storybook",
    ).buckets,
    visualizationClass: require("../test_data/combo_chart_with_three_measures_view_by_attribute_md_object.js")(
        "storybook",
    ).visualizationClass,
};

export const tableWithSorting: any = {
    executionRequest: require("../test_data/table_with_sort_request.js")("storybook").execution,
    executionResponse: require("../test_data/table_with_sort_response.js")("storybook").executionResponse,
    executionResult: require("../test_data/table_with_sort_result.js")("storybook").executionResult,
};

export const treemapWithMetricAndViewByAttributeMd: any = {
    mdObject: require("../test_data/treemap_with_metric_and_view_by_attribute_md.js")("storybook"),
};

export const treemapWithMetricAndViewByAttribute: any = {
    executionRequest: require("../test_data/treemap_with_metric_and_view_by_attribute_request.js")(
        "storybook",
    ).execution,
    executionResponse: require("../test_data/treemap_with_metric_and_view_by_attribute_response.js")(
        "storybook",
    ).executionResponse,
    executionResult: require("../test_data/treemap_with_metric_and_view_by_attribute_result.js")("storybook")
        .executionResult,
    ...treemapWithMetricAndViewByAttributeMd,
};

export const treemapWithMetricAndViewByAndOnlyOneElement: any = {
    executionRequest: require("../test_data/treemap_with_metric_and_view_by_attribute_request.js")(
        "storybook",
    ).execution,
    executionResponse: require("../test_data/treemap_with_metric_and_view_by_attribute_response.js")(
        "storybook",
    ).executionResponse,
    executionResult: require("../test_data/treemap_with_metric_and_view_by_and_only_one_element_result.js")(
        "storybook",
    ).executionResult, // tslint:disable-line:max-line-length
    ...treemapWithMetricAndViewByAttributeMd,
};

export const treemapWithMetricAndStackByAttributeMd: any = {
    mdObject: require("../test_data/treemap_with_metric_and_stack_by_attribute_md.js")("storybook"),
};

export const treemapWithMetricAndStackByAttribute: any = {
    ...treemapWithMetricAndViewByAttribute, // execution is the same
    ...treemapWithMetricAndStackByAttributeMd,
};

export const treemapWithMetricViewByAndStackByAttributeMd: any = {
    mdObject: require("../test_data/treemap_with_metric_view_by_and_stack_by_attribute_md.js")("storybook"),
};

export const treemapWithMetricViewByAndStackByAttribute: any = {
    executionRequest: require("../test_data/treemap_with_metric_view_by_and_stack_by_attribute_request.js")(
        "storybook",
    ).execution,
    executionResponse: require("../test_data/treemap_with_metric_view_by_and_stack_by_attribute_response.js")(
        "storybook",
    ).executionResponse,
    executionResult: require("../test_data/treemap_with_metric_view_by_and_stack_by_attribute_result.js")(
        "storybook",
    ).executionResult, // tslint:disable-line:max-line-length
    ...treemapWithMetricViewByAndStackByAttributeMd,
};

export const treemapWithTwoMetricsAndStackByAttributeMd: any = {
    mdObject: require("../test_data/treemap_with_two_metrics_and_stack_by_attribute_md.js")("storybook"),
};

export const treemapWithTwoMetricsAndStackByAttribute: any = {
    executionRequest: require("../test_data/treemap_with_two_metrics_and_stack_by_attribute_request.js")(
        "storybook",
    ).execution,
    executionResponse: require("../test_data/treemap_with_two_metrics_and_stack_by_attribute_response.js")(
        "storybook",
    ).executionResponse,
    executionResult: require("../test_data/treemap_with_two_metrics_and_stack_by_attribute_result.js")(
        "storybook",
    ).executionResult, // tslint:disable-line:max-line-length
    ...treemapWithTwoMetricsAndStackByAttributeMd,
};

export const treemapWithThreeMetricsMd: any = {
    mdObject: require("../test_data/treemap_with_three_metrics_md.js")("storybook"),
};

export const treemapWithThreeMetrics: any = {
    executionRequest: require("../test_data/treemap_with_three_metrics_request.js")("storybook").execution,
    executionResponse: require("../test_data/treemap_with_three_metrics_response.js")("storybook")
        .executionResponse,
    executionResult: require("../test_data/treemap_with_three_metrics_result.js")("storybook")
        .executionResult, // tslint:disable-line:max-line-length
    ...treemapWithThreeMetricsMd,
};

export const treemapWithOneMetricMd: any = {
    mdObject: require("../test_data/treemap_with_one_metric_md.js")("storybook"),
};

export const treemapWithOneMetric: any = {
    executionRequest: require("../test_data/treemap_with_one_metric_request.js")("storybook").execution,
    executionResponse: require("../test_data/treemap_with_one_metric_response.js")("storybook")
        .executionResponse,
    executionResult: require("../test_data/treemap_with_one_metric_result.js")("storybook").executionResult, // tslint:disable-line:max-line-length
    ...treemapWithOneMetricMd,
};

export const chartWith20MetricsAndViewByAttribute: any = {
    executionRequest: require("../test_data/chart_with_20_metric_and_view_by_attribute_request.js")(
        "storybook",
    ).execution,
    executionResponse: require("../test_data/chart_with_20_metric_and_view_by_attribute_reponse.js")(
        "storybook",
    ).executionResponse,
    executionResult: require("../test_data/chart_with_20_metric_and_view_by_attribute_result.js")("storybook")
        .executionResult,
};

export const metricsInSecondaryAxis = chartWith20MetricsAndViewByAttribute.executionRequest.afm.measures
    .map((measure: any, index: number) => {
        if (index % 2 === 0) {
            return measure.localIdentifier;
        }
        return null;
    })
    .filter((localIdentifier: string) => localIdentifier);

export function barChartWithNTimes3MetricsAndViewByAttribute(n = 1) {
    let dataSet: any = immutableSet(
        barChartWith3MetricsAndViewByAttribute,
        "executionRequest.afm.measures",
        repeatItemsNTimes(barChartWith3MetricsAndViewByAttribute.executionRequest.afm.measures, n),
    );
    dataSet = immutableSet(
        dataSet,
        `executionResponse.dimensions[${STACK_BY_DIMENSION_INDEX}].headers[0].measureGroupHeader.items`,
        repeatItemsNTimes(
            dataSet.executionResponse.dimensions[STACK_BY_DIMENSION_INDEX].headers[0].measureGroupHeader
                .items,
            n,
        ),
    );
    dataSet = immutableSet(
        dataSet,
        "executionResult.data",
        repeatItemsNTimes(dataSet.executionResult.data, n),
    );
    return dataSet;
}

export const barChartWith18MetricsAndViewByAttribute: any = barChartWithNTimes3MetricsAndViewByAttribute(6);

export const barChartWith60MetricsAndViewByAttribute: any = barChartWithNTimes3MetricsAndViewByAttribute(18);

export const barChartWith150MetricsAndViewByAttribute: any = barChartWithNTimes3MetricsAndViewByAttribute(54);

export const barChartWith6PopMeasuresAndViewByAttribute = (() => {
    const n = 6;
    let dataSet: any = immutableSet(
        barChartWithPopMeasureAndViewByAttribute,
        "executionRequest.afm.measures",
        range(n).reduce((result, measuresIndex) => {
            const { measures } = barChartWithPopMeasureAndViewByAttribute.executionRequest.afm;
            const popMeasure = cloneDeep(measures[0]);
            const postfix = `_${measuresIndex}`;
            popMeasure.localIdentifier += postfix;
            popMeasure.definition.popMeasure.measureIdentifier += postfix;
            popMeasure.definition.popMeasure.popAttribute = {
                uri: popMeasure.definition.popMeasure.popAttribute + postfix,
            };
            popMeasure.alias += postfix;
            const sourceMeasure = cloneDeep(measures[1]);
            sourceMeasure.localIdentifier += postfix;
            sourceMeasure.definition.measure.item.uri += postfix;
            sourceMeasure.alias += postfix;
            return result.concat([popMeasure, sourceMeasure]);
        }, []),
    );
    dataSet = immutableSet(
        dataSet,
        `executionResponse.dimensions[${STACK_BY_DIMENSION_INDEX}].headers[0].measureGroupHeader.items`,
        repeatItemsNTimes(
            dataSet.executionResponse.dimensions[STACK_BY_DIMENSION_INDEX].headers[0].measureGroupHeader
                .items,
            n,
        ).map((headerItem: any, headerItemIndex: any) => {
            const postfix = `_${Math.floor(headerItemIndex / 2)}`;
            return {
                measureHeaderItem: {
                    ...headerItem.measureHeaderItem,
                    localIdentifier: headerItem.measureHeaderItem.localIdentifier + postfix,
                },
            };
        }),
    );
    dataSet = immutableSet(
        dataSet,
        "executionResult.data",
        repeatItemsNTimes(dataSet.executionResult.data, n),
    );
    return dataSet;
})();

export const barChartWith6PreviousPeriodMeasures = (() => {
    const n = 6;
    let dataSet: any = immutableSet(
        barChartWithPreviousPeriodMeasure,
        "executionRequest.afm.measures",
        range(n).reduce((result, measuresIndex) => {
            const { measures } = barChartWithPreviousPeriodMeasure.executionRequest.afm;
            const previousPeriodMeasure = cloneDeep(measures[0]);
            const postfix = `_${measuresIndex}`;
            previousPeriodMeasure.localIdentifier += postfix;
            previousPeriodMeasure.definition.previousPeriodMeasure.measureIdentifier += postfix;
            previousPeriodMeasure.definition.previousPeriodMeasure.dateDataSets.forEach(
                (dateDataSet: any) => {
                    dateDataSet.dataSet.uri += postfix;
                },
            );
            previousPeriodMeasure.alias += postfix;
            const sourceMeasure = cloneDeep(measures[1]);
            sourceMeasure.localIdentifier += postfix;
            sourceMeasure.definition.measure.item.uri += postfix;
            sourceMeasure.alias += postfix;
            return result.concat([previousPeriodMeasure, sourceMeasure]);
        }, []),
    );
    dataSet = immutableSet(
        dataSet,
        `executionResponse.dimensions[${STACK_BY_DIMENSION_INDEX}].headers[0].measureGroupHeader.items`,
        repeatItemsNTimes(
            dataSet.executionResponse.dimensions[STACK_BY_DIMENSION_INDEX].headers[0].measureGroupHeader
                .items,
            n,
        ).map((headerItem: any, headerItemIndex: any) => {
            const postfix = `_${Math.floor(headerItemIndex / 2)}`;
            return {
                measureHeaderItem: {
                    ...headerItem.measureHeaderItem,
                    localIdentifier: headerItem.measureHeaderItem.localIdentifier + postfix,
                },
            };
        }),
    );
    dataSet = immutableSet(
        dataSet,
        "executionResult.data",
        repeatItemsNTimes(dataSet.executionResult.data, n),
    );
    return dataSet;
})();

export const customPalette = [
    {
        guid: "01",
        fill: {
            r: 255,
            g: 105,
            b: 180,
        },
    },
    {
        guid: "02",
        fill: {
            r: 212,
            g: 6,
            b: 6,
        },
    },
    {
        guid: "03",
        fill: {
            r: 238,
            g: 156,
            b: 0,
        },
    },
    {
        guid: "04",
        fill: {
            r: 227,
            g: 255,
            b: 0,
        },
    },
    {
        guid: "05",
        fill: {
            r: 6,
            g: 191,
            b: 0,
        },
    },
    {
        guid: "06",
        fill: {
            r: 0,
            g: 26,
            b: 152,
        },
    },
];

export const heatmapMetricRowColumn: any = {
    executionRequest: require("./heat_map_with_metric_row_column_request.js")("storybook").execution,
    executionResponse: require("./heat_map_with_metric_row_column_response.js")("storybook")
        .executionResponse,
    executionResult: require("./heat_map_with_metric_row_column_result.js")("storybook").executionResult,
};

export const heatmapEmptyCells: any = {
    executionRequest: require("./heat_map_with_empty_cells_request.js")("storybook").execution,
    executionResponse: require("./heat_map_with_empty_cells_response.js")("storybook").executionResponse,
    executionResult: require("./heat_map_with_empty_cells_result.js")("storybook").executionResult,
};

export const pivotTableWithTwoMetricsFourAttributesSubtotals = {
    executionRequest: require("./pivot_table_with_2_metrics_4_attributes_subtotals_request.js")(
        "ux8xk21n3al4qr1akoz7j6xkl5dt1dqj",
    ).execution,
    executionResponse: require("./pivot_table_with_2_metrics_4_attributes_subtotals_response.js")(
        "ux8xk21n3al4qr1akoz7j6xkl5dt1dqj",
    ).executionResponse,
    executionResult: require("./pivot_table_with_2_metrics_4_attributes_subtotals_result.js")(
        "ux8xk21n3al4qr1akoz7j6xkl5dt1dqj",
    ).executionResult,
};

export const dualChartWithComputedAttribute: any = {
    executionRequest: require("./dual_chart_with_computed_attribute_request.js")("storybook").execution,
    executionResponse: require("./dual_chart_with_computed_attribute_response.js")("storybook")
        .executionResponse,
    executionResult: require("./dual_chart_with_computed_attribute_result.js")("storybook").executionResult,
};

export default {
    pivotTableWithColumnAndRowAttributes,
    pivotTableWithColumnRowAttributesAndTotals,
    pivotTableWithSubtotals,
    barChartWithSingleMeasureAndNoAttributes,
    barChartWithoutAttributes,
    barChartWith3MetricsAndViewByAttribute,
    areaChartWith3MetricsAndViewByAttribute,
    areaChartWithNegativeValues,
    areaChartWith1MetricsAndStackByAttributeAndFilters,
    areaChartWithMeasureViewByAndStackBy,
    barChartWith18MetricsAndViewByAttribute,
    barChartWith60MetricsAndViewByAttribute,
    barChartWithViewByAttribute,
    barChartWithManyViewByAttributeValues,
    barChartWithStackByAndViewByAttributes,
    barChartWithPopMeasureAndViewByAttribute,
    barChartWith6PopMeasuresAndViewByAttribute,
    barChartWithPreviousPeriodMeasure,
    barChartWith6PreviousPeriodMeasures,
    pieChartWithMetricsOnly,
    barChartWithNegativeAndZeroValues,
    headlineWithOneMeasure,
    headlineWithTwoMeasures,
    comboWithTwoMeasuresAndViewByAttribute,
    comboWithTwoMeasuresAndViewByAttributeMdObject,
    scatterWithNulls,
    tableWithSorting,
    treemapWithMetricAndViewByAttribute,
    treemapWithMetricAndStackByAttribute,
    treemapWithMetricViewByAndStackByAttribute,
    treemapWithTwoMetricsAndStackByAttribute,
    treemapWithMetricAndViewByAndOnlyOneElement,
    treemapWithThreeMetrics,
    treemapWithOneMetric,
    heatmapMetricRowColumn,
    pivotTableWithTwoMetricsFourAttributesSubtotals,
};
