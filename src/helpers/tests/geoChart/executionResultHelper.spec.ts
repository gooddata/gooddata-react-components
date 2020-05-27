// (C) 2020 GoodData Corporation
import { Execution, VisualizationObject } from "@gooddata/typings";
import {
    findGeoAttributesInDimension,
    IGeoAttributesInDimension,
} from "../../geoChart/executionResultHelper";
import { getGeoData } from "../../../helpers/geoChart/data";
import {
    COLOR_ITEM,
    LOCATION_ITEM,
    SEGMENT_BY_ITEM,
    SIZE_ITEM,
    TOOLTIP_TEXT_ITEM,
} from "../../../helpers/tests/geoChart/fixtures";
import { IGeoData } from "../../../interfaces/GeoChart";
import { getExecutionResponse, getExecutionResult } from "../../../../stories/data/geoChart";

describe("findGeoAttributesInDimension", () => {
    it("should return correct data", () => {
        const mockBuckets: VisualizationObject.IBucket[] = [
            LOCATION_ITEM,
            SEGMENT_BY_ITEM,
            TOOLTIP_TEXT_ITEM,
            SIZE_ITEM,
            COLOR_ITEM,
        ];
        const mockExecution: Execution.IExecutionResponses = {
            executionResponse: getExecutionResponse(true, true, true, true, true),
            executionResult: getExecutionResult(true, true, true, true, true, 2),
        };
        const mockGeoData: IGeoData = getGeoData(mockBuckets, mockExecution);

        const expectedData: IGeoAttributesInDimension = {
            locationAttribute: {
                formOf: { identifier: "attr.state", name: "State", uri: "any-uri" },
                identifier: "label.state",
                items: [
                    {
                        attributeHeaderItem: {
                            name: "44.500000;-89.500000",
                            uri: "/gdc/md/storybook/obj/694/elements?id=1808",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            name: "39.000000;-80.500000",
                            uri: "/gdc/md/storybook/obj/694/elements?id=1903",
                        },
                    },
                ],
                localIdentifier: "a_state",
                name: "State",
                uri: "/gdc/md/projectId/obj/1",
            },
            segmentByAttribute: {
                formOf: { identifier: "attr.type", name: "Type", uri: "any-uri" },
                identifier: "label.type",
                items: [
                    {
                        attributeHeaderItem: {
                            name: "General Goods",
                            uri: "/gdc/md/storybook/obj/23/elements?id=1",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            name: "General Goods",
                            uri: "/gdc/md/storybook/obj/23/elements?id=1",
                        },
                    },
                ],
                localIdentifier: "a_type",
                name: "Type",
                uri: "/gdc/md/projectId/obj/2",
            },
            tooltipTextAttribute: {
                formOf: { identifier: "attr.state", name: "State", uri: "any-uri" },
                identifier: "label.state",
                items: [
                    {
                        attributeHeaderItem: {
                            name: "Wisconsin",
                            uri: "/gdc/md/storybook/obj/694/elements?id=1808",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            name: "West Virginia",
                            uri: "/gdc/md/storybook/obj/694/elements?id=1903",
                        },
                    },
                ],
                localIdentifier: "a_state_tooltip_text",
                name: "State",
                uri: "/gdc/md/projectId/obj/3",
            },
        };
        expect(findGeoAttributesInDimension(mockExecution, mockGeoData)).toEqual(expectedData);
    });
});
