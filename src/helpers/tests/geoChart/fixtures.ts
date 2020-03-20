// (C) 2020 GoodData Corporation
import { VisualizationObject } from "@gooddata/typings";
import { COLOR, LOCATION, SEGMENT, SIZE, TOOLTIP_TEXT } from "../../../constants/bucketNames";

export const LOCATION_ITEM: VisualizationObject.IBucket = {
    localIdentifier: LOCATION,
    items: [
        {
            visualizationAttribute: {
                localIdentifier: "a_state",
                displayForm: {
                    uri: "/gdc/md/projectId/obj/1",
                },
            },
        },
    ],
};

export const SEGMENT_BY_ITEM: VisualizationObject.IBucket = {
    localIdentifier: SEGMENT,
    items: [
        {
            visualizationAttribute: {
                localIdentifier: "a_type",
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
                localIdentifier: "a_state_tooltip_text",
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
                localIdentifier: "m_population",
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
                localIdentifier: "m_area",
                definition: {
                    measureDefinition: {
                        item: { uri: "/gdc/md/projectId/obj/5" },
                    },
                },
            },
        },
    ],
};

export const LOCATION_BUCKET_WITH_ITEM_BY_IDENTIFIER: VisualizationObject.IBucket = {
    localIdentifier: LOCATION,
    items: [
        {
            visualizationAttribute: {
                localIdentifier: "a_state",
                displayForm: {
                    identifier: "label.state",
                },
            },
        },
    ],
};

export const SEGMENT_BUCKET_WITH_ITEM_BY_IDENTIFIER: VisualizationObject.IBucket = {
    localIdentifier: SEGMENT,
    items: [
        {
            visualizationAttribute: {
                localIdentifier: "a_type",
                displayForm: {
                    identifier: "label.type",
                },
            },
        },
    ],
};

export const TOOLTIP_BUCKET_WITH_ITEM_BY_IDENTIFIER: VisualizationObject.IBucket = {
    localIdentifier: TOOLTIP_TEXT,
    items: [
        {
            visualizationAttribute: {
                localIdentifier: "a_state_tooltip_text",
                displayForm: {
                    identifier: "label.state",
                },
            },
        },
    ],
};

export const SIZE_BUCKET_WITH_ITEM_BY_IDENTIFIER: VisualizationObject.IBucket = {
    localIdentifier: SIZE,
    items: [
        {
            measure: {
                localIdentifier: "m_population",
                definition: {
                    measureDefinition: {
                        item: { identifier: "measure.population" },
                    },
                },
            },
        },
    ],
};

export const COLOR_BUCKET_WITH_ITEM_BY_IDENTIFIER: VisualizationObject.IBucket = {
    localIdentifier: COLOR,
    items: [
        {
            measure: {
                localIdentifier: "m_area",
                definition: {
                    measureDefinition: {
                        item: { identifier: "measure.area" },
                    },
                },
            },
        },
    ],
};
