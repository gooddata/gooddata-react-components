// (C) 2019 GoodData Corporation
import { AXIS } from "./axis";

const BASE_PROPERTIES = ["dataLabels.visible", "grid", "legend", "colorMapping"];

const BASE_X_AXIS_PROPERTIES = [
    "xaxis.rotation",
    "xaxis.labelsEnabled",
    "xaxis.visible",
    "xaxis.name.visible",
    "xaxis.name.position",
];

const BASE_Y_AXIS_PROPERTIES = [
    "yaxis.rotation",
    "yaxis.labelsEnabled",
    "yaxis.visible",
    "yaxis.name.visible",
    "yaxis.name.position",
];

const BASE_PRIMARY_AXIS_PROPERTIES = [...BASE_Y_AXIS_PROPERTIES, "yaxis.min", "yaxis.max"];

const BAR_PRIMARY_AXIS_PROPERTIES = [...BASE_X_AXIS_PROPERTIES, "xaxis.min", "xaxis.max"];

const BASE_SECONDARY_AXIS_PROPERTIES = [
    "secondary_yaxis.rotation",
    "secondary_yaxis.labelsEnabled",
    "secondary_yaxis.visible",
    "secondary_yaxis.min",
    "secondary_yaxis.max",
    "secondary_yaxis.measures",
    "secondary_yaxis.name.visible",
    "secondary_yaxis.name.position",
];

const BAR_SECONDARY_AXIS_PROPERTIES = [
    "secondary_xaxis.rotation",
    "secondary_xaxis.labelsEnabled",
    "secondary_xaxis.visible",
    "secondary_xaxis.min",
    "secondary_xaxis.max",
    "secondary_xaxis.measures",
    "secondary_xaxis.name.visible",
    "secondary_xaxis.name.position",
];

export const OPTIONAL_STACKING_PROPERTIES = ["stackMeasures", "stackMeasuresToPercent"];

export const CHART_TYPE_PROPERTIES = ["primaryChartType", "secondaryChartType", "dualAxis"];

export const BASE_CHART_SUPPORTED_PROPERTIES = [
    ...BASE_PROPERTIES,
    ...BASE_X_AXIS_PROPERTIES,
    ...BASE_PRIMARY_AXIS_PROPERTIES,
];

export const AREA_CHART_SUPPORTED_PROPERTIES = [
    ...BASE_CHART_SUPPORTED_PROPERTIES,
    ...OPTIONAL_STACKING_PROPERTIES,
];

export const COLUMN_CHART_SUPPORTED_PROPERTIES = {
    [AXIS.PRIMARY]: [...BASE_CHART_SUPPORTED_PROPERTIES, ...OPTIONAL_STACKING_PROPERTIES],
    [AXIS.SECONDARY]: [
        ...BASE_PROPERTIES,
        ...BASE_X_AXIS_PROPERTIES,
        ...BASE_SECONDARY_AXIS_PROPERTIES,
        ...OPTIONAL_STACKING_PROPERTIES,
    ],
    [AXIS.DUAL]: [
        ...BASE_CHART_SUPPORTED_PROPERTIES,
        ...BASE_SECONDARY_AXIS_PROPERTIES,
        ...OPTIONAL_STACKING_PROPERTIES,
    ],
};

export const LINE_CHART_SUPPORTED_PROPERTIES = {
    [AXIS.PRIMARY]: BASE_CHART_SUPPORTED_PROPERTIES,
    [AXIS.SECONDARY]: [...BASE_PROPERTIES, ...BASE_X_AXIS_PROPERTIES, ...BASE_SECONDARY_AXIS_PROPERTIES],
    [AXIS.DUAL]: [...BASE_CHART_SUPPORTED_PROPERTIES, ...BASE_SECONDARY_AXIS_PROPERTIES],
};

export const BAR_CHART_SUPPORTED_PROPERTIES = {
    [AXIS.PRIMARY]: [
        ...BASE_PROPERTIES,
        ...BASE_Y_AXIS_PROPERTIES,
        ...BAR_PRIMARY_AXIS_PROPERTIES,
        ...OPTIONAL_STACKING_PROPERTIES,
    ],
    [AXIS.SECONDARY]: [
        ...BASE_PROPERTIES,
        ...BASE_Y_AXIS_PROPERTIES,
        ...BAR_SECONDARY_AXIS_PROPERTIES,
        ...OPTIONAL_STACKING_PROPERTIES,
    ],
    [AXIS.DUAL]: [
        ...BASE_PROPERTIES,
        ...BASE_Y_AXIS_PROPERTIES,
        ...BAR_PRIMARY_AXIS_PROPERTIES,
        ...BAR_SECONDARY_AXIS_PROPERTIES,
        ...OPTIONAL_STACKING_PROPERTIES,
    ],
};

export const COMBO_CHART_SUPPORTED_PROPERTIES = {
    [AXIS.PRIMARY]: [
        ...BASE_CHART_SUPPORTED_PROPERTIES,
        ...CHART_TYPE_PROPERTIES,
        ...OPTIONAL_STACKING_PROPERTIES,
    ],
    [AXIS.SECONDARY]: [
        ...BASE_PROPERTIES,
        ...BASE_X_AXIS_PROPERTIES,
        ...BASE_SECONDARY_AXIS_PROPERTIES,
        ...CHART_TYPE_PROPERTIES,
        ...OPTIONAL_STACKING_PROPERTIES,
    ],
    [AXIS.DUAL]: [
        ...BASE_CHART_SUPPORTED_PROPERTIES,
        ...BASE_SECONDARY_AXIS_PROPERTIES,
        ...CHART_TYPE_PROPERTIES,
        ...OPTIONAL_STACKING_PROPERTIES,
    ],
};

export const BUBBLE_CHART_SUPPORTED_PROPERTIES = [
    "dataLabels.visible",
    "grid",
    "xaxis.rotation",
    "xaxis.labelsEnabled",
    "xaxis.visible",
    "xaxis.min",
    "xaxis.max",
    "xaxis.name.visible",
    "xaxis.name.position",

    "yaxis.labelsEnabled",
    "yaxis.rotation",
    "yaxis.visible",
    "yaxis.min",
    "yaxis.max",
    "yaxis.name.visible",
    "yaxis.name.position",

    "legend",
    "colorMapping",
];

export const SCATTERPLOT_SUPPORTED_PROPERTIES = [
    "dataLabels.visible",
    "grid",
    "xaxis.rotation",
    "xaxis.labelsEnabled",
    "xaxis.visible",
    "xaxis.min",
    "xaxis.max",
    "xaxis.name.visible",
    "xaxis.name.position",

    "yaxis.labelsEnabled",
    "yaxis.rotation",
    "yaxis.visible",
    "yaxis.min",
    "yaxis.max",
    "yaxis.name.visible",
    "yaxis.name.position",
    "colorMapping",
];

export const PIECHART_SUPPORTED_PROPERTIES = [
    "dataLabels.visible",
    "legend",
    "colorMapping",
    "chart.verticalAlign",
];

export const TREEMAP_SUPPORTED_PROPERTIES = ["dataLabels.visible", "legend", "colorMapping"];

export const HEATMAP_SUPPORTED_PROPERTIES = [
    "dataLabels.visible",
    "legend",
    "yaxis.rotation",
    "yaxis.labelsEnabled",
    "yaxis.visible",
    "yaxis.name.visible",
    "yaxis.name.position",

    "xaxis.labelsEnabled",
    "xaxis.rotation",
    "xaxis.visible",
    "xaxis.name.visible",
    "xaxis.name.position",
    "colorMapping",
];
