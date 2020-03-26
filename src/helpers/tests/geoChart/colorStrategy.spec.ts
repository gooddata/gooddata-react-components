// (C) 2020 GoodData Corporation

import { Execution, AFM } from "@gooddata/typings";
import { getColorStrategy } from "../../geoChart/colorStrategy";
import { DEFAULT_COLOR_PALETTE } from "../../../interfaces/Config";
import {
    getExecutionResponse,
    getExecutionResult,
    LOCATION_LNGLATS,
} from "../../../../stories/data/geoChart";
import { IGeoData } from "../../../interfaces/GeoChart";
import { locationDataSource } from "../../../components/tests/mocks";

describe("getColorStrategy", () => {
    it("should return GeoChartColorStrategy", () => {
        const afm: AFM.IAfm = locationDataSource.getAfm();
        const excution: Execution.IExecutionResponses = {
            executionResponse: getExecutionResponse(true),
            executionResult: getExecutionResult(true),
        };
        const geoData: IGeoData = {
            location: {
                index: 0,
                name: "location",
                data: LOCATION_LNGLATS,
            },
        };
        const geoChartColorStrategy = getColorStrategy(
            DEFAULT_COLOR_PALETTE,
            undefined,
            geoData,
            excution,
            afm,
        );
        const colorAssignmentExpected = [
            {
                color: {
                    type: "guid",
                    value: "1",
                },
                headerItem: {
                    attributeHeader: {
                        identifier: "label.state",
                        name: "State",
                        uri: "/gdc/md/projectId/obj/1",
                        localIdentifier: "a_state",
                        formOf: {
                            identifier: "attr.state",
                            name: "State",
                            uri: "any-uri",
                        },
                    },
                },
            },
        ];
        expect(geoChartColorStrategy.getColorAssignment()).toEqual(colorAssignmentExpected);
        expect(geoChartColorStrategy.getColorByIndex(0)).toEqual("rgb(20,178,226)");
        expect(geoChartColorStrategy.getColorByIndex(1)).toBeUndefined();
        expect(geoChartColorStrategy.getFullColorAssignment()).toEqual(colorAssignmentExpected);
    });
});
