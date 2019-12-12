// (C) 2007-2019 GoodData Corporation
import { factory as createSdk, SDK, IFeatureFlags } from "@gooddata/gooddata-js";
import { getFeatureFlags, setConfigFromFeatureFlags } from "../featureFlags";
import { IChartConfig } from "../../interfaces/Config";

describe("getFeatureFlags", () => {
    const projectId = "project";
    const featureFlags = { featureFlag: true };
    const getSdkWithFeatureFlags = (featureFlags = {}): SDK => {
        const mutatedSdk = createSdk();
        mutatedSdk.project.getFeatureFlags = jest.fn(() => Promise.resolve(featureFlags));
        return mutatedSdk;
    };

    it("should call sdk getFeatureFlags", async () => {
        const sdk = getSdkWithFeatureFlags(featureFlags);
        await getFeatureFlags(sdk, projectId);
        expect(sdk.project.getFeatureFlags).toHaveBeenCalledWith(projectId);
    });

    it("should return correct feature flags", async () => {
        const sdk = getSdkWithFeatureFlags(featureFlags);
        const resultFeatureFlags = await getFeatureFlags(sdk, projectId);
        expect(resultFeatureFlags).toEqual(featureFlags);
    });
});

describe("setConfigFromFeatureFlags", () => {
    it("should return correct config from feature flags", async () => {
        const config: IChartConfig = {};
        const featureFlags: IFeatureFlags = {
            disableKpiDashboardHeadlineUnderline: true,
        };
        const expectedConfig = {
            disableDrillUnderline: true,
        };
        expect(setConfigFromFeatureFlags(config, featureFlags)).toEqual(expectedConfig);
    });

    it("should return correct config from undefined feature flags", async () => {
        const config: IChartConfig = {};
        const featureFlags: IFeatureFlags = undefined;
        expect(setConfigFromFeatureFlags(config, featureFlags)).toEqual(config);
    });
});
