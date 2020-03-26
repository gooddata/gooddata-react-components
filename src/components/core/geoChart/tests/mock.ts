// (C) 2020 GoodData Corporation
import { AFM } from "@gooddata/typings";
import GeoChartColorStrategy from "../../../visualizations/chart/colorStrategies/geoChart";
import { DEFAULT_COLOR_PALETTE } from "../../../../interfaces/Config";
import { getExecutionResponse } from "../../../../../stories/data/geoChart";
import { DEFAULT_COLORS } from "../../../visualizations/utils/color";
import { IColorStrategy } from "../../../visualizations/chart/colorFactory";

export function buildMockColorStrategy(): IColorStrategy {
    const afm: AFM.IAfm = {};
    const mockColorStrategy = new GeoChartColorStrategy(
        DEFAULT_COLOR_PALETTE,
        null,
        null,
        null,
        getExecutionResponse(true),
        afm,
    );
    const mockGetColorByIndex = jest.spyOn(mockColorStrategy, "getColorByIndex");
    const mockGetColorAssignment = jest.spyOn(mockColorStrategy, "getColorAssignment");
    mockGetColorByIndex.mockImplementation(index => DEFAULT_COLORS[index]);
    mockGetColorAssignment.mockImplementation(() => [
        {
            headerItem: {
                attributeHeader: {
                    uri: "location",
                    identifier: "location",
                    localIdentifier: "location",
                    name: "location",
                    formOf: {
                        uri: "location",
                        identifier: "location",
                        name: "location",
                    },
                },
            },
            color: {
                type: "guid",
                value: "1",
            },
        },
    ]);

    return mockColorStrategy;
}
