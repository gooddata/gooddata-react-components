// (C) 2007-2020 GoodData Corporation
import { factory as createSdk, SDK, IFeatureFlags } from "@gooddata/gooddata-js";
import { getFeatureFlags, setConfigFromFeatureFlags, getTableConfigFromFeatureFlags } from "../featureFlags";
import { IChartConfig } from "../../interfaces/Config";
import { VisualizationEnvironment } from "../../components/uri/Visualization";
import { IColumnSizing, IPivotTableConfig } from "../../interfaces/PivotTable";

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

describe("getTableConfigFromFeatureFlags", () => {
    const columnWidths = [
        {
            attributeColumnWidthItem: {
                width: 740,
                attributeIdentifier: "294512a6b2ed4be8bd3948dd14db1950",
            },
        },
    ];

    it.each([
        [false, false, false, "none", undefined],
        [true, false, false, "none", { columnWidths }],
        [false, true, false, "none", { defaultWidth: "viewport" }],
        [false, false, true, "none", undefined],
        [true, true, false, "none", { columnWidths, defaultWidth: "viewport" }],
        [true, false, true, "none", { columnWidths }],
        [false, true, true, "none", { defaultWidth: "viewport" }],
        [true, true, true, "none", { defaultWidth: "viewport", columnWidths }],
        [false, false, false, "dashboards", undefined],
        [true, false, false, "dashboards", { columnWidths }],
        [false, true, false, "dashboards", { defaultWidth: "viewport" }],
        [false, false, true, "dashboards", { growToFit: true }],
        [true, true, false, "dashboards", { columnWidths, defaultWidth: "viewport" }],
        [true, false, true, "dashboards", { columnWidths, growToFit: true }],
        [false, true, true, "dashboards", { defaultWidth: "viewport", growToFit: true }],
        [true, true, true, "dashboards", { columnWidths, defaultWidth: "viewport", growToFit: true }],
    ])(
        "should create correct columnSizing config base on feature manualResizing:%s autoResizing:%s growToFit:%s in environment:%s",
        (
            enableTableColumnsManualResizing: boolean,
            enableTableColumnsAutoResizing: boolean,
            enableTableColumnsGrowToFit: boolean,
            environment: VisualizationEnvironment,
            expectedColumnSizing: IColumnSizing,
        ) => {
            const result = getTableConfigFromFeatureFlags(
                {},
                {
                    enableTableColumnsManualResizing,
                    enableTableColumnsAutoResizing,
                    enableTableColumnsGrowToFit,
                },
                environment === "dashboards",
                columnWidths,
            );
            expect(result.columnSizing).toEqual(expectedColumnSizing);
        },
    );

    it("should use explicit config if provided", () => {
        const explicitConfig: IPivotTableConfig = {
            columnSizing: {
                columnWidths,
                growToFit: true,
                defaultWidth: "viewport",
            },
        };
        const result = getTableConfigFromFeatureFlags(
            explicitConfig,
            {
                enableTableColumnsManualResizing: false,
                enableTableColumnsAutoResizing: false,
                enableTableColumnsGrowToFit: false,
            },
            false,
            columnWidths,
        );
        expect(result.columnSizing).toEqual(explicitConfig.columnSizing);
    });
});
