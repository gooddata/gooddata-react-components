// (C) 2007-2021 GoodData Corporation
import isNil = require("lodash/isNil");
import isEmpty = require("lodash/isEmpty");
import { IFeatureFlags, SDK } from "@gooddata/gooddata-js";
import { getCachedOrLoad } from "./sdkCache";
import { IChartConfig } from "../interfaces/Config";
import { IColumnSizing, IPivotTableConfig, ColumnWidthItem } from "../interfaces/PivotTable";

export async function getFeatureFlags(sdk: SDK, projectId: string): Promise<IFeatureFlags> {
    const apiCallIdentifier = `getFeatureFlags.${projectId}`;
    const loader = () => sdk.project.getFeatureFlags(projectId);
    try {
        return await getCachedOrLoad(apiCallIdentifier, loader);
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.error(`unable to retrieve featureFlags for project ${projectId}`, error);
        throw Error(error);
    }
}

export function setConfigFromFeatureFlags(config: IChartConfig, featureFlags: IFeatureFlags): IChartConfig {
    if (!featureFlags) {
        return config;
    }

    let result = config;
    if (
        featureFlags.disableKpiDashboardHeadlineUnderline === true &&
        (!config || isNil(config.disableDrillUnderline))
    ) {
        result = { ...result, disableDrillUnderline: true };
    }
    return result;
}

export function getTableConfigFromFeatureFlags(
    config: IPivotTableConfig,
    featureFlags: IFeatureFlags,
    isDashboardsEnvironment: boolean = false,
    widthDefs?: ColumnWidthItem[],
): IPivotTableConfig {
    let columnSizing: IColumnSizing = {};

    if (featureFlags.enableTableColumnsAutoResizing) {
        columnSizing = { defaultWidth: "viewport" };
    }

    if (featureFlags.enableTableColumnsManualResizing && widthDefs) {
        columnSizing = {
            ...columnSizing,
            columnWidths: widthDefs,
        };
    }

    if (featureFlags.enableTableColumnsGrowToFit && isDashboardsEnvironment) {
        columnSizing = {
            ...columnSizing,
            growToFit: true,
        };
    }
    const configColumnSizing = config && config.columnSizing;
    const columnSizingProp =
        isEmpty(columnSizing) && !configColumnSizing
            ? {}
            : {
                  columnSizing: {
                      ...columnSizing,
                      ...configColumnSizing,
                  },
              };
    return {
        ...config,
        ...columnSizingProp,
    };
}
