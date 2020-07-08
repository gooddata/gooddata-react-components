// (C) 2020 GoodData Corporation
import { AFM } from "@gooddata/typings";
// sortItems based on referencePointMocks.simpleStackedReferencePoint
export const validMeasureSort: AFM.IMeasureSortItem = {
    measureSortItem: {
        direction: "asc",
        locators: [
            {
                attributeLocatorItem: {
                    attributeIdentifier: "a2",
                    element: "/gdc/md/PROJECTID/obj/2210/elements?id=1234",
                },
            },
            {
                measureLocatorItem: {
                    measureIdentifier: "m1",
                },
            },
        ],
    },
};

export const validAttributeSort: AFM.IAttributeSortItem = {
    attributeSortItem: {
        attributeIdentifier: "a1",
        direction: "desc",
    },
};

export const invalidAttributeSort: AFM.IAttributeSortItem = {
    attributeSortItem: {
        attributeIdentifier: "invalid",
        direction: "desc",
    },
};

export const invalidMeasureSortInvalidMeasure: AFM.IMeasureSortItem = {
    measureSortItem: {
        direction: "asc",
        locators: [
            {
                attributeLocatorItem: {
                    attributeIdentifier: "a2",
                    element: "/gdc/md/PROJECTID/obj/2210/elements?id=1234",
                },
            },
            {
                measureLocatorItem: {
                    measureIdentifier: "invalid", // this measure is not in buckets
                },
            },
        ],
    },
};

export const invalidMeasureSortInvalidAttribute: AFM.IMeasureSortItem = {
    measureSortItem: {
        direction: "asc",
        locators: [
            {
                attributeLocatorItem: {
                    attributeIdentifier: "a1", // this identifier doesn't exist on second dimension
                    element: "/gdc/md/PROJECTID/obj/2210/elements?id=1234",
                },
            },
            {
                measureLocatorItem: {
                    measureIdentifier: "m1",
                },
            },
        ],
    },
};

export const invalidMeasureSortTooManyLocators: AFM.IMeasureSortItem = {
    measureSortItem: {
        direction: "asc",
        locators: [
            {
                attributeLocatorItem: {
                    attributeIdentifier: "a2",
                    element: "/gdc/md/PROJECTID/obj/2210/elements?id=1234",
                },
            },
            {
                attributeLocatorItem: {
                    attributeIdentifier: "a2",
                    element: "/gdc/md/PROJECTID/obj/2210/elements?id=1234",
                },
            },
            {
                measureLocatorItem: {
                    measureIdentifier: "m1",
                },
            },
        ],
    },
};

export const invalidMeasureSortLocatorsTooShort: AFM.IMeasureSortItem = {
    measureSortItem: {
        direction: "asc",
        locators: [
            {
                measureLocatorItem: {
                    measureIdentifier: "m1",
                },
            },
        ],
    },
};
