// (C) 2020 GoodData Corporation
import { AFM } from "@gooddata/typings";
import { IHighchartsPointObject, IDrillEventIntersectionElement } from "../../../../interfaces/DrillEvents";

export const simpleAfm: AFM.IAfm = {
    measures: [
        {
            localIdentifier: "id1",
            definition: {
                measure: {
                    item: {
                        uri: "uri1",
                    },
                },
            },
        },
    ],
};
export const afm: AFM.IAfm = {
    measures: [
        ...simpleAfm.measures,
        {
            localIdentifier: "id2",
            definition: {
                measure: {
                    item: {
                        uri: "uri2",
                    },
                },
            },
        },
        {
            localIdentifier: "id3",
            definition: {
                measure: {
                    item: {
                        uri: "uri3",
                    },
                },
            },
        },
    ],
};

export const point: Partial<IHighchartsPointObject> = {
    x: 1,
    y: 2,
    value: 678.0,
    drillIntersection: [
        {
            header: {
                measureHeaderItem: {
                    uri: "uri1",
                    identifier: "identifier1",
                    localIdentifier: "id1",
                    name: "title",
                    format: "",
                },
            },
        },
        {
            header: {
                measureHeaderItem: {
                    uri: "uri2",
                    identifier: "identifier2",
                    localIdentifier: "id2",
                    name: "title",
                    format: "",
                },
            },
        },
        {
            header: {
                measureHeaderItem: {
                    uri: "uri3",
                    identifier: "identifier3",
                    localIdentifier: "id3",
                    name: "title",
                    format: "",
                },
            },
        },
    ],
};

export const expectedLegacyIntersection: IDrillEventIntersectionElement[] = [
    {
        id: "id1",
        title: "title",
        header: {
            uri: "uri1",
            identifier: "identifier1",
        },
    },
    {
        id: "id2",
        title: "title",
        header: {
            uri: "uri2",
            identifier: "identifier2",
        },
    },
    {
        id: "id3",
        title: "title",
        header: {
            uri: "uri3",
            identifier: "identifier3",
        },
    },
];
