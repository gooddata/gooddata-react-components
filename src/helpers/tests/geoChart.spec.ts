// (C) 2019-2020 GoodData Corporation
import { VisualizationObject } from "@gooddata/typings";
import { COLOR, LOCATION, SEGMENT_BY, SIZE, TOOLTIP_TEXT } from "../../constants/bucketNames";
import { getGeoDataIndex } from "../geoChart";

describe("geoChart", () => {
    const LOCATION_ITEM: VisualizationObject.IBucket = {
        localIdentifier: LOCATION,
        items: [
            {
                visualizationAttribute: {
                    localIdentifier: "a_location",
                    displayForm: {
                        uri: "/gdc/md/projectId/obj/1",
                    },
                },
            },
        ],
    };

    const SEGMENT_BY_ITEM: VisualizationObject.IBucket = {
        localIdentifier: SEGMENT_BY,
        items: [
            {
                visualizationAttribute: {
                    localIdentifier: "a_segmentBy",
                    displayForm: {
                        uri: "/gdc/md/projectId/obj/2",
                    },
                },
            },
        ],
    };

    const TOOLTIP_TEXT_ITEM: VisualizationObject.IBucket = {
        localIdentifier: TOOLTIP_TEXT,
        items: [
            {
                visualizationAttribute: {
                    localIdentifier: "a_tooltipText",
                    displayForm: {
                        uri: "/gdc/md/projectId/obj/3",
                    },
                },
            },
        ],
    };

    const SIZE_ITEM: VisualizationObject.IBucket = {
        localIdentifier: SIZE,
        items: [
            {
                measure: {
                    localIdentifier: "m_size",
                    definition: {
                        measureDefinition: {
                            item: { uri: "/gdc/md/projectId/obj/4" },
                        },
                    },
                },
            },
        ],
    };

    const COLOR_ITEM: VisualizationObject.IBucket = {
        localIdentifier: COLOR,
        items: [
            {
                measure: {
                    localIdentifier: "m_color",
                    definition: {
                        measureDefinition: {
                            item: { uri: "/gdc/md/projectId/obj/5" },
                        },
                    },
                },
            },
        ],
    };

    it("should return geoDataIndex with full bucket", () => {
        const buckets: VisualizationObject.IBucket[] = [
            LOCATION_ITEM,
            SEGMENT_BY_ITEM,
            TOOLTIP_TEXT_ITEM,
            SIZE_ITEM,
            COLOR_ITEM,
        ];

        expect(getGeoDataIndex(buckets)).toEqual({
            location: 0,
            segmentBy: 1,
            tooltipText: 2,
            size: 0,
            color: 1,
        });
    });

    it("should return geoDataIndex with location, tooltipText, size", () => {
        const buckets: VisualizationObject.IBucket[] = [LOCATION_ITEM, TOOLTIP_TEXT_ITEM, SIZE_ITEM];

        expect(getGeoDataIndex(buckets)).toEqual({
            location: 0,
            tooltipText: 1,
            size: 0,
        });
    });

    it("should return geoDataIndex with segmentBy, color", () => {
        const buckets: VisualizationObject.IBucket[] = [SEGMENT_BY_ITEM, COLOR_ITEM];

        expect(getGeoDataIndex(buckets)).toEqual({
            segmentBy: 0,
            color: 0,
        });
    });
});
