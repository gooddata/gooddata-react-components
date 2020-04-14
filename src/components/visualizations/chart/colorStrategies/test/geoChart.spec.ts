// (C) 2020 GoodData Corporation

import { AFM, Execution } from "@gooddata/typings";
import { locationDataSource, locationSizeColorSegmentDataSource } from "../../../../tests/mocks";
import { getExecutionResponse } from "../../../../../../stories/data/geoChart";
import { DEFAULT_COLOR_PALETTE } from "../../../utils/color";
import { IColorPalette } from "../../../../..";
import GeoChartColorStrategy from "../geoChart";
import { IColorMapping } from "../../../../../interfaces/Config";

describe("GeoChartColorStrategy", () => {
    const colorPalette: IColorPalette = DEFAULT_COLOR_PALETTE;
    const locationAttribute: Execution.IAttributeHeader = {
        attributeHeader: {
            identifier: "30.df",
            uri: "/gdc/md/storybook/obj/30.df",
            name: "City",
            localIdentifier: "location",
            formOf: {
                uri: "/gdc/md/storybook/obj/30.df",
                identifier: "30",
                name: "City",
            },
        },
    };
    it("should return GeoChartColorStrategy base on Location Attribute with properly applied mapping", () => {
        const colorMapping: IColorMapping[] = [
            {
                predicate: (headerItem: Execution.IAttributeHeader) =>
                    headerItem.attributeHeader &&
                    headerItem.attributeHeader.uri === "/gdc/md/storybook/obj/30.df",
                color: {
                    type: "guid",
                    value: "2",
                },
            },
        ];
        const afm: AFM.IAfm = locationDataSource.getAfm();
        const executionResponse: Execution.IExecutionResponse = getExecutionResponse(true);
        const colorStrategy = new GeoChartColorStrategy(
            colorPalette,
            colorMapping,
            locationAttribute,
            null,
            executionResponse,
            afm,
        );
        expect(colorStrategy.getColorAssignment()).toEqual([
            {
                color: { type: "guid", value: "2" },
                headerItem: {
                    attributeHeader: {
                        formOf: {
                            identifier: "30",
                            name: "City",
                            uri: "/gdc/md/storybook/obj/30.df",
                        },
                        identifier: "30.df",
                        localIdentifier: "location",
                        name: "City",
                        uri: "/gdc/md/storybook/obj/30.df",
                    },
                },
            },
        ]);
    });
    it("should return GeoChartColorStrategy base on Segment Attribute with properly applied mapping", () => {
        const colorMapping: IColorMapping[] = [
            {
                predicate: (headerItem: Execution.IResultAttributeHeaderItem) =>
                    headerItem.attributeHeaderItem &&
                    headerItem.attributeHeaderItem.uri === "/gdc/md/storybook/obj/23/elements?id=2",
                color: {
                    type: "guid",
                    value: "7",
                },
            },
        ];
        const segmentAttribute = {
            identifier: "23.df",
            uri: "/gdc/md/storybook/obj/23.df",
            name: "Store Type",
            localIdentifier: "segmentBy",
            formOf: {
                uri: "/gdc/md/storybook/obj/23",
                identifier: "23",
                name: "Store Type",
            },
            items: [
                {
                    attributeHeaderItem: {
                        name: "General Goods",
                        uri: "/gdc/md/storybook/obj/23/elements?id=1",
                    },
                },
                { attributeHeaderItem: { name: "Toy Store", uri: "/gdc/md/storybook/obj/23/elements?id=2" } },
            ],
        };
        const afm: AFM.IAfm = locationSizeColorSegmentDataSource.getAfm();
        const executionResponse: Execution.IExecutionResponse = getExecutionResponse(
            true,
            true,
            false,
            true,
            true,
        );
        const colorStrategy = new GeoChartColorStrategy(
            colorPalette,
            colorMapping,
            locationAttribute,
            segmentAttribute,
            executionResponse,
            afm,
        );
        expect(colorStrategy.getColorAssignment()).toEqual([
            {
                color: { type: "guid", value: "1" },
                headerItem: {
                    attributeHeaderItem: {
                        name: "General Goods",
                        uri: "/gdc/md/storybook/obj/23/elements?id=1",
                    },
                },
            },
            {
                color: { type: "guid", value: "7" },
                headerItem: {
                    attributeHeaderItem: {
                        name: "Toy Store",
                        uri: "/gdc/md/storybook/obj/23/elements?id=2",
                    },
                },
            },
        ]);
    });
});
