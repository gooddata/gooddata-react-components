// (C) 2020 GoodData Corporation
import { VisualizationObject } from "@gooddata/typings";
import { COLOR, LOCATION, SEGMENT_BY, SIZE, TOOLTIP_TEXT } from "../../../constants/bucketNames";

export const LOCATION_ITEM: VisualizationObject.IBucket = {
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

export const SEGMENT_BY_ITEM: VisualizationObject.IBucket = {
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

export const TOOLTIP_TEXT_ITEM: VisualizationObject.IBucket = {
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

export const SIZE_ITEM: VisualizationObject.IBucket = {
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

export const COLOR_ITEM: VisualizationObject.IBucket = {
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
