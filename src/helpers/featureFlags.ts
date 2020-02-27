// (C) 2007-2020 GoodData Corporation
import { IFeatureFlags, SDK } from "@gooddata/gooddata-js";
import { getCachedOrLoad } from "./sdkCache";
import { IChartConfig } from "../interfaces/Config";

export async function getFeatureFlags(sdk: SDK, projectId: string): Promise<IFeatureFlags> {
    const apiCallIdentifier = `getFeatureFlags.${projectId}`;
    const loader = () => sdk.project.getFeatureFlags(projectId);
    try {
        return getCachedOrLoad(apiCallIdentifier, loader);
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

    if (featureFlags.disableKpiDashboardHeadlineUnderline === true) {
        result = { ...result, disableDrillUnderline: true };
    }

    return result;
}

export function getTableConfigFromFeatureFlags(featureFlags: IFeatureFlags) {
    if (featureFlags.enableTableColumnsAutoResizing) {
        return { columnSizing: { defaultWidth: "viewport" } };
    }

    return {};
}
