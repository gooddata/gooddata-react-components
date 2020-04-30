// (C) 2020 GoodData Corporation
import { AFM } from "@gooddata/typings";
import { convertDrillContextToLegacy } from "../drilldownEventingLegacy";
import {
    IDrillEventContextExtended,
    IDrillEventIntersectionElementExtended,
} from "../../../../interfaces/DrillEvents";
import { VisType, VisualizationTypes } from "../../../../constants/visualizationTypes";
import { getDrillIntersection } from "../../../visualizations/utils/drilldownEventing";
import { createIntlMock } from "../intlUtils";
import * as fixtures from "../../../../../stories/test_data/fixtures";
import * as drilldownEventingFixtures from "./drilldownEventing.fixtures";
import { executionToAGGridAdapter } from "../../../core/pivotTable/agGridDataSource";
import { getTreeLeaves } from "../../../core/pivotTable/agGridUtils";
import { IMappingHeader } from "../../../../interfaces/MappingHeader";

const pivotTableWithColumnAndRowAttributes = fixtures.pivotTableWithColumnAndRowAttributes;
const intl = createIntlMock();

describe("convertDrillContextToLegacy", () => {
    describe("for headline and xirr", () => {
        const simpleAfm: AFM.IAfm = {
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
        const afm: AFM.IAfm = {
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
        it.each([["headline"], ["xirr"]])("should handle empty intersection for %s", (type: VisType) => {
            const emptyDrillContext: IDrillEventContextExtended = {
                type,
                element: "primaryValue",
                intersection: [],
            };
            expect(convertDrillContextToLegacy(emptyDrillContext, afm)).toEqual(emptyDrillContext);
        });

        it.each([["headline"], ["xirr"]])(
            "should convert IMeasureHeaderItem in extended selection for %s",
            (type: VisType) => {
                const afm: AFM.IAfm = {
                    measures: [
                        {
                            localIdentifier: "m1",
                            definition: {
                                measure: {
                                    item: {
                                        uri: "/gdc/md/project_id/obj/1",
                                    },
                                },
                            },
                        },
                    ],
                };
                const drillIntersectionExtended: IDrillEventIntersectionElementExtended = {
                    header: {
                        measureHeaderItem: {
                            name: "Lost",
                            format: "$#,##0.00",
                            localIdentifier: "m1",
                            uri: "/gdc/md/project_id/obj/1",
                            identifier: "metric.lost",
                        },
                    },
                };
                const measureDrillContext: IDrillEventContextExtended = {
                    type,
                    element: "primaryValue",
                    intersection: [drillIntersectionExtended],
                };

                const expectedIntersection = [
                    {
                        id: "m1",
                        title: "Lost",
                        header: {
                            uri: "/gdc/md/project_id/obj/1",
                            identifier: "",
                        },
                    },
                ];
                const expectedDrillContext = {
                    type,
                    element: "primaryValue",
                    intersection: expectedIntersection,
                };

                expect(convertDrillContextToLegacy(measureDrillContext, afm)).toEqual(expectedDrillContext);
            },
        );
    });

    describe("for pivot table", () => {
        const afm = pivotTableWithColumnAndRowAttributes.executionRequest.afm;
        const { columnDefs, rowData } = executionToAGGridAdapter(
            {
                executionResponse: pivotTableWithColumnAndRowAttributes.executionResponse,
                executionResult: pivotTableWithColumnAndRowAttributes.executionResult,
            },
            {},
            intl,
        );

        const expectedColumnLegacyIntersection = [
            {
                header: {
                    identifier: "",
                    uri: "/gdc/md/xms7ga4tf3g3nzucd8380o2bev8oeknp/obj/2009/elements?id=1",
                },
                id: "1",
                title: "Q1",
            },
            {
                header: {
                    identifier: "date.aam81lMifn6q",
                    uri: "/gdc/md/xms7ga4tf3g3nzucd8380o2bev8oeknp/obj/2011",
                },
                id: "year",
                title: "Quarter (Date)",
            },
            {
                header: {
                    identifier: "",
                    uri: "/gdc/md/xms7ga4tf3g3nzucd8380o2bev8oeknp/obj/2071/elements?id=1",
                },
                id: "1",
                title: "Jan",
            },
            {
                header: {
                    identifier: "date.abm81lMifn6q",
                    uri: "/gdc/md/xms7ga4tf3g3nzucd8380o2bev8oeknp/obj/2073",
                },
                id: "month",
                title: "Month (Date)",
            },
            {
                header: {
                    identifier: "aabHeqImaK0d",
                    uri: "/gdc/md/xms7ga4tf3g3nzucd8380o2bev8oeknp/obj/6694",
                },
                id: "franchiseFeesAdRoyaltyIdentifier",
                title: "$ Franchise Fees (Ad Royalty)",
            },
        ];
        it("should return intersection of row attribute and row attribute value for row header cell and keep rest of drill context", async () => {
            const rowColDef = columnDefs[0]; // row header
            const drillItems = [rowData[0].headerItemMap[rowColDef.field], ...rowColDef.drillItems];
            const drillContext: IDrillEventContextExtended = {
                type: "table",
                element: "cell",
                intersection: getDrillIntersection(drillItems),
            };
            const result = convertDrillContextToLegacy(drillContext, afm);
            expect(result.type).toEqual("table");
            expect(result.element).toEqual("cell");
            expect(result.intersection).toEqual([
                {
                    header: {
                        identifier: "label.restaurantlocation.locationstate",
                        uri: "/gdc/md/xms7ga4tf3g3nzucd8380o2bev8oeknp/obj/2211",
                    },
                    id: "state",
                    title: "Location State",
                },
                {
                    header: {
                        identifier: "",
                        uri: "/gdc/md/xms7ga4tf3g3nzucd8380o2bev8oeknp/obj/2210/elements?id=6340109",
                    },
                    id: "6340109",
                    title: "Alabama",
                },
            ]);
        });

        it("should return intersection of all column header attributes and values and a measure for column header cell", async () => {
            const colDef = getTreeLeaves(columnDefs)[3]; // column leaf header
            const drillContext: IDrillEventContextExtended = {
                type: "table",
                element: "cell",
                intersection: getDrillIntersection(colDef.drillItems),
            };
            const result = convertDrillContextToLegacy(drillContext, afm);

            expect(result.intersection).toEqual(expectedColumnLegacyIntersection);
        });

        it("should remove row attributes and values from intersection when converting to legacy", async () => {
            const rowColDef = columnDefs[0]; // row header
            const drillItems = [rowData[0].headerItemMap[rowColDef.field], ...rowColDef.drillItems];
            const colDef = getTreeLeaves(columnDefs)[3]; // column leaf header
            const drillContext: IDrillEventContextExtended = {
                type: "table",
                element: "cell",
                intersection: getDrillIntersection([...colDef.drillItems, ...drillItems]),
            };
            const result = convertDrillContextToLegacy(drillContext, afm);

            expect(result.intersection).toEqual(expectedColumnLegacyIntersection);
        });

        // tslint:disable-next-line:max-line-length
        it("should return intersection without header property when measure has neither uri nor identifier (arithmetic measure)", async () => {
            const drillItems: IMappingHeader[] = [
                {
                    measureHeaderItem: {
                        localIdentifier: "am1",
                        name: "Arithmetic measure",
                        format: "",
                    },
                },
            ];
            const drillContext: IDrillEventContextExtended = {
                type: "table",
                element: "cell",
                intersection: getDrillIntersection(drillItems),
            };
            const result = convertDrillContextToLegacy(drillContext, afm);

            expect(result.intersection).toEqual([
                {
                    id: "am1",
                    title: "Arithmetic measure",
                },
            ]);
        });
    });

    describe("for other charts", () => {
        // other use cases covered in drildownEventing.chartClick
        it("should convert basic intersection", async () => {
            const { x, y, value, drillIntersection } = drilldownEventingFixtures.point;
            const drillContextPoint = {
                x,
                y,
                value,
                intersection: drillIntersection,
            };

            const drillContext: IDrillEventContextExtended = {
                type: VisualizationTypes.LINE,
                element: "point",
                points: [drillContextPoint],
            };
            const result = convertDrillContextToLegacy(drillContext, drilldownEventingFixtures.afm);

            expect(result).toEqual({
                type: VisualizationTypes.LINE,
                element: "point",
                points: [
                    {
                        x,
                        y,
                        value,
                        intersection: drilldownEventingFixtures.expectedLegacyIntersection,
                    },
                ],
            });
        });
    });
});
