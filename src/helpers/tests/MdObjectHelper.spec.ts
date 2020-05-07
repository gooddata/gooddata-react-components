// (C) 2007-2020 GoodData Corporation
import { VisualizationObject, AFM, VisualizationInput } from "@gooddata/typings";
import MdObjectHelper, { areAllMeasuresOnSingleAxis, getMeasuresFromMdObject } from "../MdObjectHelper";
import { IGeoConfig } from "../../interfaces/GeoChart";
import { visualizationObjects, geoPushpinMDO, pivotTableMDO } from "../../../__mocks__/fixtures";

describe("MdObjectHelper", () => {
    describe("getTotals", () => {
        it("should return table totals for table chart", () => {
            const totals = MdObjectHelper.getTotals(visualizationObjects[1].visualizationObject);

            expect(totals).toEqual([
                {
                    alias: "average",
                    attributeIdentifier: "a1",
                    measureIdentifier: "m1",
                    type: "avg",
                },
            ]);
        });

        it("should return empty table totals for bar chart", () => {
            const totals = MdObjectHelper.getTotals(visualizationObjects[0].visualizationObject);
            expect(totals).toEqual([]);
        });
    });

    describe("getVisualizationClassUri", () => {
        it("should return uri", () => {
            expect(
                MdObjectHelper.getVisualizationClassUri(visualizationObjects[0].visualizationObject),
            ).toEqual("/gdc/md/myproject/obj/column");
        });
    });

    describe("buildMeasureTitleProps", () => {
        it("should correctly convert every known measure type to title props object", () => {
            const measures: VisualizationObject.IMeasure[] = [
                {
                    measure: {
                        localIdentifier: "m1",
                        definition: {
                            measureDefinition: {
                                item: {
                                    uri: "/uri1",
                                },
                            },
                        },
                        title: "M1",
                    },
                },
                {
                    measure: {
                        localIdentifier: "m2",
                        definition: {
                            popMeasureDefinition: {
                                popAttribute: {
                                    uri: "/uri2",
                                },
                                measureIdentifier: "m1",
                            },
                        },
                        title: "M2",
                    },
                },
                {
                    measure: {
                        localIdentifier: "m3",
                        definition: {
                            previousPeriodMeasure: {
                                dateDataSets: [
                                    {
                                        dataSet: {
                                            uri: "/uri3",
                                        },
                                        periodsAgo: 1,
                                    },
                                ],
                                measureIdentifier: "m1",
                            },
                        },
                        title: "M3",
                    },
                },
                {
                    measure: {
                        localIdentifier: "m4",
                        definition: {
                            arithmeticMeasure: {
                                measureIdentifiers: ["m1", "m2"],
                                operator: "sum",
                            },
                        },
                        title: "M4",
                    },
                },
                {
                    measure: {
                        localIdentifier: "m5",
                        definition: {
                            measureDefinition: {
                                item: {
                                    uri: "/uri5",
                                },
                            },
                        },
                        title: "M5",
                        alias: "Renamed M5",
                    },
                },
                {
                    measure: {
                        localIdentifier: "m6",
                        definition: {
                            measureDefinition: {
                                item: {
                                    uri: "/uri6",
                                },
                            },
                        },
                    },
                },
            ];
            const measureTitleProps = MdObjectHelper.buildMeasureTitleProps(measures);

            expect(measureTitleProps).toEqual([
                {
                    localIdentifier: "m1",
                    title: "M1",
                },
                {
                    localIdentifier: "m2",
                    title: "M2",
                },
                {
                    localIdentifier: "m3",
                    title: "M3",
                },
                {
                    localIdentifier: "m4",
                    title: "M4",
                },
                {
                    localIdentifier: "m5",
                    title: "M5",
                    alias: "Renamed M5",
                },
                {
                    localIdentifier: "m6",
                },
            ]);
        });
    });

    describe("buildArithmeticMeasureTitleProps", () => {
        it("should correctly convert arithmetic measure definition", () => {
            const arithmeticMeasureProps = MdObjectHelper.buildArithmeticMeasureTitleProps({
                arithmeticMeasure: {
                    operator: "change",
                    measureIdentifiers: ["m1", "m2"],
                },
            });

            expect(arithmeticMeasureProps).toEqual({
                operator: "change",
                masterMeasureLocalIdentifiers: ["m1", "m2"],
            });
        });
    });

    describe("mdObjectToGeoPushpinBucketProps", () => {
        it("should convert MDO to Geo pushpin chart's bucket props", () => {
            const config: IGeoConfig = {
                mapboxToken: "",
                tooltipText: {
                    visualizationAttribute: {
                        displayForm: {
                            uri: "/gdc/md/myproject/obj/853",
                        },
                        localIdentifier: "tooltip",
                    },
                },
            };

            const filtersFromProps: AFM.ExtendedFilter[] = [
                {
                    relativeDateFilter: {
                        to: 0,
                        from: -3,
                        granularity: "GDC.time.quarter",
                        dataSet: {
                            uri: "/gdc/md/myproject/obj/921",
                        },
                    },
                },
                {
                    measureValueFilter: {
                        measure: {
                            localIdentifier: "m2",
                        },
                        condition: {
                            comparison: {
                                operator: "GREATER_THAN",
                                value: 420,
                            },
                        },
                    },
                },
            ];

            const bucketProps = MdObjectHelper.mdObjectToGeoPushpinBucketProps(
                config,
                geoPushpinMDO.visualizationObject,
                filtersFromProps,
            );

            const expectedColor: VisualizationInput.IMeasure = {
                measure: {
                    definition: {
                        measureDefinition: {
                            item: {
                                uri: "/gdc/md/myproject/obj/8173",
                            },
                        },
                    },
                    localIdentifier: "color",
                    title: "Amount Avg",
                },
            };

            const expectedConfig: IGeoConfig = {
                mapboxToken: "",
                tooltipText: {
                    visualizationAttribute: {
                        displayForm: {
                            uri: "/gdc/md/myproject/obj/853",
                        },
                        localIdentifier: "tooltip",
                    },
                },
            };

            const expectedSize: VisualizationInput.IMeasure = {
                measure: {
                    definition: {
                        measureDefinition: {
                            item: {
                                uri: "/gdc/md/myproject/obj/8172",
                            },
                        },
                    },
                    localIdentifier: "size",
                    title: "Amount",
                },
            };

            const expectedLocation: VisualizationInput.IAttribute = {
                visualizationAttribute: {
                    displayForm: {
                        uri: "/gdc/md/myproject/obj/851",
                    },
                    localIdentifier: "location",
                },
            };

            const expectedSegmentBy: VisualizationInput.IAttribute = {
                visualizationAttribute: {
                    displayForm: {
                        uri: "/gdc/md/myproject/obj/852",
                    },
                    localIdentifier: "segment",
                },
            };

            const expectedFilters: VisualizationInput.IFilter[] = [
                {
                    relativeDateFilter: {
                        dataSet: {
                            uri: "/gdc/md/myproject/obj/921",
                        },
                        from: -3,
                        granularity: "GDC.time.quarter",
                        to: 0,
                    },
                },
                {
                    measureValueFilter: {
                        measure: {
                            localIdentifier: "m2",
                        },
                        condition: {
                            comparison: {
                                operator: "GREATER_THAN",
                                value: 420,
                            },
                        },
                    },
                },
            ];

            expect(bucketProps.color).toEqual(expectedColor);
            expect(bucketProps.config).toEqual(expectedConfig);
            expect(bucketProps.filters).toEqual(expectedFilters);
            expect(bucketProps.location).toEqual(expectedLocation);
            expect(bucketProps.segmentBy).toEqual(expectedSegmentBy);
            expect(bucketProps.size).toEqual(expectedSize);
        });
    });

    describe("mdObjectToPivotBucketProps", () => {
        it("should convert MDO to pivot table bucket props", () => {
            const filtersFromProps: AFM.ExtendedFilter[] = [
                {
                    relativeDateFilter: {
                        to: 0,
                        from: -3,
                        granularity: "GDC.time.quarter",
                        dataSet: {
                            uri: "/gdc/md/myproject/obj/921",
                        },
                    },
                },
                {
                    measureValueFilter: {
                        measure: {
                            localIdentifier: "m2",
                        },
                        condition: {
                            comparison: {
                                operator: "GREATER_THAN",
                                value: 420,
                            },
                        },
                    },
                },
            ];
            const pivotTableBucketProps = MdObjectHelper.mdObjectToPivotBucketProps(
                pivotTableMDO.visualizationObject,
                filtersFromProps,
            );

            const expectedMeasures: VisualizationInput.IMeasure[] = [
                {
                    measure: {
                        definition: {
                            measureDefinition: {
                                item: {
                                    uri: "/gdc/md/myproject/obj/8172",
                                },
                            },
                        },
                        localIdentifier: "m1",
                        title: "# Accounts with AD Query",
                    },
                },
                {
                    measure: {
                        definition: {
                            measureDefinition: {
                                item: {
                                    uri: "/gdc/md/myproject/obj/8173",
                                },
                            },
                        },
                        localIdentifier: "m2",
                        title: "Measure 2",
                    },
                },
            ];

            const expectedColumns: VisualizationInput.IAttribute[] = [
                {
                    visualizationAttribute: {
                        displayForm: {
                            uri: "/gdc/md/myproject/obj/853",
                        },
                        localIdentifier: "a3",
                    },
                },
            ];

            const expectedRows: VisualizationInput.IAttribute[] = [
                {
                    visualizationAttribute: {
                        displayForm: {
                            uri: "/gdc/md/myproject/obj/851",
                        },
                        localIdentifier: "a1",
                    },
                },
                {
                    visualizationAttribute: {
                        displayForm: {
                            uri: "/gdc/md/myproject/obj/852",
                        },
                        localIdentifier: "a2",
                    },
                },
            ];

            const expectedFilters: VisualizationInput.IFilter[] = [
                {
                    measureValueFilter: {
                        measure: {
                            localIdentifier: "m1",
                        },
                        condition: {
                            comparison: {
                                operator: "GREATER_THAN",
                                value: 42,
                            },
                        },
                    },
                },
                {
                    relativeDateFilter: {
                        dataSet: {
                            uri: "/gdc/md/myproject/obj/921",
                        },
                        from: -3,
                        granularity: "GDC.time.quarter",
                        to: 0,
                    },
                },
                {
                    measureValueFilter: {
                        measure: {
                            localIdentifier: "m2",
                        },
                        condition: {
                            comparison: {
                                operator: "GREATER_THAN",
                                value: 420,
                            },
                        },
                    },
                },
            ];

            const expectedTotals: VisualizationInput.ITotal[] = [
                {
                    alias: "average",
                    attributeIdentifier: "a1",
                    measureIdentifier: "m1",
                    type: "avg",
                },
                {
                    alias: "Native total",
                    attributeIdentifier: "a2",
                    measureIdentifier: "m1",
                    type: "nat",
                },
            ];

            expect(pivotTableBucketProps.measures).toEqual(expectedMeasures);
            expect(pivotTableBucketProps.columns).toEqual(expectedColumns);
            expect(pivotTableBucketProps.rows).toEqual(expectedRows);
            expect(pivotTableBucketProps.filters).toEqual(expectedFilters);
            expect(pivotTableBucketProps.totals).toEqual(expectedTotals);
        });
    });

    describe("getMeasuresFromMdObject", () => {
        it("should return measures from MDO", () => {
            const measures = getMeasuresFromMdObject(visualizationObjects[0].visualizationObject.content);

            const expectedMeasures: VisualizationInput.IMeasure[] = [
                {
                    measure: {
                        definition: {
                            measureDefinition: {
                                filters: [],
                                item: {
                                    uri: "/gdc/md/myproject/obj/3276",
                                },
                            },
                        },
                        localIdentifier: "m1",
                        title: "# Logged-in Users",
                    },
                },
                {
                    measure: {
                        definition: {
                            measureDefinition: {
                                filters: [],
                                item: {
                                    uri: "/gdc/md/myproject/obj/1995",
                                },
                            },
                        },
                        localIdentifier: "m2",
                        title: "# Users Opened AD",
                    },
                },
            ];

            expect(measures).toEqual(expectedMeasures);
        });
    });

    describe("areAllMeasuresOnSingleAxis", () => {
        it("should return true if all measures are on primary axis", () => {
            const isSingleAxis = areAllMeasuresOnSingleAxis(
                visualizationObjects[0].visualizationObject.content,
                undefined,
            );
            expect(isSingleAxis).toEqual(true);
        });

        it("should return true if all measures are on secondary axis", () => {
            const isSingleAxis = areAllMeasuresOnSingleAxis(
                visualizationObjects[0].visualizationObject.content,
                { measures: ["m1", "m2"] },
            );
            expect(isSingleAxis).toEqual(true);
        });

        it("should return true if measures is undefined on secondary axis config", () => {
            const isSingleAxis = areAllMeasuresOnSingleAxis(
                visualizationObjects[0].visualizationObject.content,
                {},
            );
            expect(isSingleAxis).toEqual(true);
        });

        it("should return false if measures are on 2 axes", () => {
            const isSingleAxis = areAllMeasuresOnSingleAxis(
                visualizationObjects[0].visualizationObject.content,
                { measures: ["m1"] },
            );
            expect(isSingleAxis).toEqual(false);
        });
    });
});
