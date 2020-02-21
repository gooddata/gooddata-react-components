// (C) 2019-2020 GoodData Corporation
import { IUiConfig } from "../interfaces/Visualization";

import { METRIC, FACT, ATTRIBUTE, DATE } from "./bucket";
import { OverTimeComparisonTypes } from "../../interfaces/OverTimeComparison";
import { VisualizationTypes } from "../../constants/visualizationTypes";

export const MAX_METRICS_COUNT = 20;
export const DEFAULT_PIE_METRICS_COUNT = 1;
export const DEFAULT_TREEMAP_MEASURES_COUNT = 1;
export const MAX_FILTERS_COUNT = 20;
export const MAX_CATEGORIES_COUNT = 1;
export const MAX_TABLE_CATEGORIES_COUNT = 20;
export const MAX_STACKS_COUNT = 1;
export const MAX_VIEW_COUNT = 2;
export const DEFAULT_HEADLINE_METRICS_COUNT = 1;
export const DEFAULT_XIRR_METRICS_COUNT = 1;
export const DEFAULT_XIRR_ATTRIBUTES_COUNT = 1;
export const DEFAULT_GEO_ATTRIBUTES_COUNT = 1;
export const DEFAULT_PUSHPIN_METRICS_COUNT = 1;

export const UICONFIG = "uiConfig";
export const RECOMMENDATIONS = "recommendations";
export const SUPPORTED_COMPARISON_TYPES = "supportedOverTimeComparisonTypes";
export const OPEN_AS_REPORT = "openAsReport";
export const SUPPORTED = "supported";
export const UICONFIG_AXIS = "uiConfig.axis";

export const measuresBase = {
    accepts: [METRIC, FACT, ATTRIBUTE],
    allowsDuplicateItems: true,
    enabled: true,
    allowsReordering: true,
    allowsSwapping: true,
    itemsLimit: MAX_METRICS_COUNT,
    isShowInPercentEnabled: false,
    isShowInPercentVisible: true,
};

export const viewBase = {
    accepts: [ATTRIBUTE, DATE],
    itemsLimit: MAX_CATEGORIES_COUNT,
    allowsSwapping: true,
    allowsReordering: false,
    enabled: true,
    isShowInPercentEnabled: false,
};

const stackBase = {
    accepts: [ATTRIBUTE],
    itemsLimit: MAX_STACKS_COUNT,
    allowsSwapping: true,
    allowsReordering: false,
    enabled: true,
    isShowInPercentEnabled: false,
};

export const defaultFilters = {
    filters: {
        accepts: [ATTRIBUTE, DATE],
        itemsLimit: MAX_FILTERS_COUNT,
        allowsReordering: false,
        enabled: true,
        isShowInPercentEnabled: false,
    },
};

export const disabledExportConfig = {
    exportConfig: { supported: false },
};

export const enabledExportConfig = {
    exportConfig: { supported: true },
};

export const disabledOpenAsReportConfig = {
    openAsReport: { supported: false },
};

export const enabledOpenAsReportConfig = {
    openAsReport: { supported: true },
};

export const defaultRootUiConfigProperties: Partial<IUiConfig> = {
    recommendations: {},
    supportedOverTimeComparisonTypes: [],
    ...disabledOpenAsReportConfig,
    ...enabledExportConfig,
};

export const DEFAULT_SCATTERPLOT_UICONFIG: IUiConfig = {
    buckets: {
        measures: {
            ...measuresBase,
            isShowInPercentVisible: false,
            allowsReordering: false,
            canAddItems: true,
            itemsLimit: 1,
        },
        secondary_measures: {
            ...measuresBase,
            isShowInPercentVisible: false,
            allowsReordering: false,
            canAddItems: true,
            itemsLimit: 1,
        },
        attribute: {
            ...viewBase,
            allowsReordering: false,
            allowsSwapping: false,
            canAddItems: true,
            itemsLimit: MAX_STACKS_COUNT,
        },
        ...defaultFilters,
    },
    ...defaultRootUiConfigProperties,
};

export const DEFAULT_BUBBLE_CHART_CONFIG: IUiConfig = {
    buckets: {
        measures: {
            ...measuresBase,
            isShowInPercentVisible: false,
            allowsReordering: false,
            canAddItems: true,
            itemsLimit: 1,
        },
        secondary_measures: {
            ...measuresBase,
            isShowInPercentVisible: false,
            allowsReordering: false,
            canAddItems: true,
            itemsLimit: 1,
        },
        tertiary_measures: {
            ...measuresBase,
            isShowInPercentVisible: false,
            allowsReordering: false,
            canAddItems: true,
            itemsLimit: 1,
        },
        view: {
            ...viewBase,
            allowsReordering: false,
            allowsSwapping: false,
            canAddItems: true,
            itemsLimit: 1,
        },
        ...defaultFilters,
    },
    ...defaultRootUiConfigProperties,
};

export const DEFAULT_BASE_CHART_UICONFIG: IUiConfig = {
    buckets: {
        measures: {
            ...measuresBase,
        },
        view: {
            ...viewBase,
        },
        stack: {
            ...stackBase,
        },
        ...defaultFilters,
    },
    ...defaultRootUiConfigProperties,
    ...enabledOpenAsReportConfig,
};

export const DEFAULT_BAR_CHART_UICONFIG: IUiConfig = {
    buckets: {
        measures: {
            ...measuresBase,
            isShowOnSecondaryAxisVisible: true,
        },
        view: {
            ...viewBase,
        },
        stack: {
            ...stackBase,
        },
        ...defaultFilters,
    },
    ...defaultRootUiConfigProperties,
    ...enabledOpenAsReportConfig,
    supportedOverTimeComparisonTypes: [
        OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
        OverTimeComparisonTypes.PREVIOUS_PERIOD,
    ],
};

export const COLUMN_BAR_CHART_UICONFIG: IUiConfig = {
    buckets: {
        measures: {
            ...measuresBase,
            isShowOnSecondaryAxisVisible: true,
        },
        view: {
            ...viewBase,
            allowsReordering: true,
            itemsLimit: MAX_VIEW_COUNT,
        },
        stack: {
            ...stackBase,
        },
        ...defaultFilters,
    },
    ...defaultRootUiConfigProperties,
    ...enabledOpenAsReportConfig,
    supportedOverTimeComparisonTypes: [
        OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
        OverTimeComparisonTypes.PREVIOUS_PERIOD,
    ],
    optionalStacking: {
        supported: true,
        stackMeasures: false,
    },
};

export const DEFAULT_LINE_UICONFIG: IUiConfig = {
    buckets: {
        measures: {
            ...measuresBase,
            isShowOnSecondaryAxisVisible: true,
        },
        trend: {
            ...viewBase,
        },
        segment: {
            ...stackBase,
        },
        ...defaultFilters,
    },
    ...defaultRootUiConfigProperties,
    ...enabledOpenAsReportConfig,
    supportedOverTimeComparisonTypes: [
        OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
        OverTimeComparisonTypes.PREVIOUS_PERIOD,
    ],
};

export const DEFAULT_AREA_UICONFIG: IUiConfig = {
    buckets: {
        measures: {
            ...measuresBase,
        },
        view: {
            ...viewBase,
            allowsReordering: true,
            itemsLimit: MAX_VIEW_COUNT,
        },
        stack: {
            ...stackBase,
        },
        ...defaultFilters,
    },
    ...defaultRootUiConfigProperties,
    ...enabledOpenAsReportConfig,
    optionalStacking: {
        supported: true,
        stackMeasures: true,
    },
};

export const DEFAULT_PIE_UICONFIG: IUiConfig = {
    buckets: {
        measures: {
            ...measuresBase,
            itemsLimit: DEFAULT_PIE_METRICS_COUNT,
            allowsReordering: false,
        },
        view: {
            ...viewBase,
        },
        ...defaultFilters,
    },
    ...defaultRootUiConfigProperties,
    ...enabledOpenAsReportConfig,
};

export const PIE_UICONFIG_WITH_MULTIPLE_METRICS: IUiConfig = {
    buckets: {
        measures: {
            ...measuresBase,
        },
        view: {
            ...viewBase,
            itemsLimit: 0,
        },
        ...defaultFilters,
    },
    ...defaultRootUiConfigProperties,
    ...enabledOpenAsReportConfig,
};

export const PIE_UICONFIG_WITH_ONE_METRIC: IUiConfig = {
    buckets: {
        measures: {
            ...measuresBase,
        },
        view: {
            ...viewBase,
        },
        ...defaultFilters,
    },
    ...defaultRootUiConfigProperties,
    ...enabledOpenAsReportConfig,
};

export const DEFAULT_TREEMAP_UICONFIG: IUiConfig = {
    buckets: {
        measures: {
            ...measuresBase,
        },
        view: {
            ...viewBase,
        },
        segment: {
            ...stackBase,
        },
        ...defaultFilters,
    },
    ...defaultRootUiConfigProperties,
};

export const TREEMAP_UICONFIG_WITH_MULTIPLE_MEASURES: IUiConfig = {
    buckets: {
        measures: {
            ...measuresBase,
        },
        view: {
            ...viewBase,
            itemsLimit: 0,
        },
        segment: {
            ...stackBase,
        },
        ...defaultFilters,
    },
    ...defaultRootUiConfigProperties,
};

export const TREEMAP_UICONFIG_WITH_ONE_MEASURE: IUiConfig = {
    buckets: {
        measures: {
            ...measuresBase,
            itemsLimit: DEFAULT_TREEMAP_MEASURES_COUNT,
            allowsReordering: false,
            canAddItems: false,
            isShowInPercentEnabled: true,
        },
        view: {
            ...viewBase,
        },
        segment: {
            ...stackBase,
        },
        ...defaultFilters,
    },
    ...defaultRootUiConfigProperties,
};

export const DEFAULT_PIVOT_TABLE_UICONFIG: IUiConfig = {
    buckets: {
        measures: {
            ...measuresBase,
        },
        attribute: {
            ...viewBase,
            allowsSwapping: true,
            allowsReordering: true,
            itemsLimit: MAX_TABLE_CATEGORIES_COUNT,
        },
        columns: {
            ...viewBase,
            allowsSwapping: true,
            allowsReordering: true,
            itemsLimit: MAX_TABLE_CATEGORIES_COUNT,
        },
        ...defaultFilters,
    },
    ...defaultRootUiConfigProperties,
    ...disabledOpenAsReportConfig,
    supportedOverTimeComparisonTypes: [
        OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
        OverTimeComparisonTypes.PREVIOUS_PERIOD,
    ],
};

export const DEFAULT_TABLE_UICONFIG: IUiConfig = {
    buckets: {
        measures: {
            ...measuresBase,
        },
        attribute: {
            ...viewBase,
            allowsSwapping: false,
            allowsReordering: true,
            itemsLimit: MAX_TABLE_CATEGORIES_COUNT,
        },
        ...defaultFilters,
    },
    ...defaultRootUiConfigProperties,
    ...enabledOpenAsReportConfig,
    supportedOverTimeComparisonTypes: [
        OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
        OverTimeComparisonTypes.PREVIOUS_PERIOD,
    ],
};

export const DEFAULT_HEADLINE_UICONFIG: IUiConfig = {
    buckets: {
        measures: {
            ...measuresBase,
            itemsLimit: DEFAULT_HEADLINE_METRICS_COUNT,
            isShowInPercentVisible: false,
            allowsReordering: false,
        },
        secondary_measures: {
            ...measuresBase,
            itemsLimit: DEFAULT_HEADLINE_METRICS_COUNT,
            isShowInPercentVisible: false,
            allowsReordering: false,
        },
        ...defaultFilters,
    },
    ...defaultRootUiConfigProperties,
    ...disabledExportConfig,
    supportedOverTimeComparisonTypes: [
        OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
        OverTimeComparisonTypes.PREVIOUS_PERIOD,
    ],
};

export const DEFAULT_HEATMAP_UICONFIG: IUiConfig = {
    buckets: {
        measures: {
            accepts: [METRIC, FACT, ATTRIBUTE],
            enabled: true,
            allowsReordering: false,
            allowsSwapping: true,
            itemsLimit: 1,
            isShowInPercentEnabled: false,
            isShowInPercentVisible: false,
            icon: "",
            canAddItems: true,
            allowsDuplicateItems: true,
        },
        view: {
            accepts: [ATTRIBUTE, DATE],
            itemsLimit: 1,
            allowsSwapping: true,
            allowsReordering: false,
            enabled: true,
            isShowInPercentEnabled: false,
            icon: "",
            canAddItems: true,
        },
        stack: {
            accepts: [ATTRIBUTE, DATE],
            itemsLimit: 1,
            allowsSwapping: true,
            allowsReordering: false,
            enabled: true,
            isShowInPercentEnabled: false,
            icon: "",
            canAddItems: true,
        },
        ...defaultFilters,
    },
    ...defaultRootUiConfigProperties,
};

export const COMBO_CHART_UICONFIG_DEPRECATED: IUiConfig = {
    buckets: {
        measures: {
            ...measuresBase,
        },
        secondary_measures: {
            ...measuresBase,
        },
        view: {
            ...viewBase,
            itemsLimit: 1,
        },
        ...defaultFilters,
    },
    recommendations: {},
    supportedOverTimeComparisonTypes: [],
};

export const COMBO_CHART_UICONFIG: IUiConfig = {
    buckets: {
        measures: {
            ...measuresBase,
            canAddItems: true,
            allowSelectChartType: true,
            allowOptionalStacking: true,
        },
        secondary_measures: {
            ...measuresBase,
            canAddItems: true,
            allowSelectChartType: true,
            allowShowOnSecondaryAxis: true,
        },
        view: {
            ...viewBase,
            canAddItems: true,
            itemsLimit: 1,
        },
        ...defaultFilters,
    },
    ...defaultRootUiConfigProperties,
    supportedOverTimeComparisonTypes: [
        OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
        OverTimeComparisonTypes.PREVIOUS_PERIOD,
    ],
    supportedChartTypes: [VisualizationTypes.COLUMN, VisualizationTypes.LINE, VisualizationTypes.AREA],
    optionalStacking: {
        supported: true,
        disabled: false,
        stackMeasures: false,
    },
};

export const DEFAULT_XIRR_UICONFIG: IUiConfig = {
    buckets: {
        measures: {
            ...measuresBase,
            accepts: [METRIC, FACT],
            itemsLimit: DEFAULT_XIRR_METRICS_COUNT,
            isShowInPercentVisible: false,
        },
        attribute: {
            ...viewBase,
            accepts: [DATE],
            itemsLimit: DEFAULT_XIRR_ATTRIBUTES_COUNT,
        },
        ...defaultFilters,
    },
    ...defaultRootUiConfigProperties,
    ...disabledExportConfig,
};

const geoMeasuresBase = {
    ...measuresBase,
    allowsReordering: false,
    itemsLimit: DEFAULT_PUSHPIN_METRICS_COUNT,
    isShowInPercentVisible: false,
    canAddItems: true,
};

const geoAttributesBase = {
    ...viewBase,
    accepts: [ATTRIBUTE],
    itemsLimit: DEFAULT_GEO_ATTRIBUTES_COUNT,
};

export const GEO_PUSHPIN_CHART_UICONFIG: IUiConfig = {
    buckets: {
        location: {
            ...geoAttributesBase,
        },
        size: {
            ...geoMeasuresBase,
        },
        color: {
            ...geoMeasuresBase,
        },
        segment: {
            ...geoAttributesBase,
        },
        ...defaultFilters,
    },
    supportedLocationIcon: { supported: true },
    ...defaultRootUiConfigProperties,
};
