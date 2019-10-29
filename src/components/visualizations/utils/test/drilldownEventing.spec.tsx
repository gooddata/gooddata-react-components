// (C) 2007-2019 GoodData Corporation
import cloneDeep = require("lodash/cloneDeep");
import { AFM } from "@gooddata/typings";
import Highcharts from "../../chart/highcharts/highchartsEntryPoint";
import {
    getClickableElementNameByChartType,
    chartClick,
    cellClick,
    createDrillIntersectionElement,
    convertHeadlineDrillIntersectionToLegacy,
    getDrillIntersection,
} from "../drilldownEventing";
import { VisualizationTypes } from "../../../../constants/visualizationTypes";
import { SeriesChartTypes } from "../../../../constants/series";
import {
    IDrillConfig,
    IHighchartsPointObject,
    IDrillEventIntersectionElementExtended,
    IDrillEventIntersectionElement,
} from "../../../../interfaces/DrillEvents";
import { IMappingHeader } from "../../../../interfaces/MappingHeader";
import { executionToAGGridAdapter } from "../../../core/pivotTable/agGridDataSource";
import { pivotTableWithColumnAndRowAttributes } from "../../../../../stories/test_data/fixtures";
import { createIntlMock } from "../intlUtils";
import { getTreeLeaves } from "../../../core/pivotTable/agGridUtils";

describe("Drilldown Eventing", () => {
    jest.useFakeTimers();
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

    const point: Partial<IHighchartsPointObject> = {
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
    const expectedLegacyIntersection: IDrillEventIntersectionElement[] = [
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

    const pointClickEventData = ({ point } as any) as Highcharts.DrilldownEventObject;

    it("should get clickable chart element name", () => {
        const fn = getClickableElementNameByChartType;
        expect(fn(VisualizationTypes.LINE)).toBe("point");
        expect(fn(VisualizationTypes.COLUMN)).toBe("bar");
        expect(fn(VisualizationTypes.BAR)).toBe("bar");
        expect(fn(VisualizationTypes.PIE)).toBe("slice");
        expect(fn(VisualizationTypes.TREEMAP)).toBe("slice");
        expect(fn(VisualizationTypes.HEATMAP)).toBe("cell");
        expect(() => {
            fn("headline"); // headline is not defined
        }).toThrowError();
    });

    describe("should handle click on point drill context (non-group) when event.points given but null", () => {
        const drillConfig = { afm, onFiredDrillEvent: () => true, onDrill: jest.fn() };
        const target = { dispatchEvent: jest.fn() };
        const pointClickEventDataWithNullPoints: Highcharts.DrilldownEventObject = {
            ...pointClickEventData,
            points: null,
        };

        chartClick(
            drillConfig,
            pointClickEventDataWithNullPoints,
            (target as any) as EventTarget,
            VisualizationTypes.LINE,
        );

        jest.runAllTimers();

        const drillContext = target.dispatchEvent.mock.calls[0][0].detail.drillContext;
        it("by dispatching legacy event", () => {
            expect(drillContext.element).toEqual("point");
        });

        it("by dispatching calling onDrill with new event", () => {
            expect(drillConfig.onDrill.mock.calls[0][0].drillContext).toEqual({
                element: "point",
                type: "line",
                x: 1,
                y: 2,
                intersection: point.drillIntersection,
            });
        });
    });

    it("should call default fire event on point click and fire correct data", () => {
        const drillConfig = { afm, onFiredDrillEvent: () => true };
        const target = { dispatchEvent: jest.fn() };

        chartClick(drillConfig, pointClickEventData, (target as any) as EventTarget, VisualizationTypes.LINE);

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual({
            executionContext: afm,
            drillContext: {
                type: "line",
                element: "point",
                x: 1,
                y: 2,
                intersection: expectedLegacyIntersection,
            },
        });
    });

    it('should fire correct data with property "value" for treemap and heatmap', () => {
        const drillConfig = { afm, onFiredDrillEvent: () => true };
        const target = { dispatchEvent: jest.fn() };

        chartClick(
            drillConfig,
            pointClickEventData,
            (target as any) as EventTarget,
            VisualizationTypes.TREEMAP,
        );

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail.drillContext.value).toBe("678");

        chartClick(
            drillConfig,
            pointClickEventData,
            (target as any) as EventTarget,
            VisualizationTypes.HEATMAP,
        );

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail.drillContext.value).toBe("678");
    });

    it("should remove duplicated values for heatmap", () => {
        const drillIntersections: IDrillEventIntersectionElementExtended[] = [
            {
                header: {
                    attributeHeaderItem: {
                        uri:
                            "/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/1281/elements?id=1deea80aa5a54d1bbbc2e2de63989eef",
                        name: "Best Case",
                    },
                    attributeHeader: {
                        uri: "/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/1282",
                        identifier: "ac3EwmqvbxcX",
                        localIdentifier: "a1",
                        name: "Case",
                        formOf: {
                            uri: "/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/1281",
                            identifier: "identifier1",
                            name: "Case",
                        },
                    },
                },
            },
            {
                header: {
                    attributeHeaderItem: {
                        uri: "/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/951/elements?id=168279",
                        name: "CompuSci",
                    },
                    attributeHeader: {
                        uri: "/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/952",
                        identifier: "label.product.id.name",
                        localIdentifier: "a2",
                        name: "Product",
                        formOf: {
                            uri: "/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/951",
                            identifier: "label.product.id",
                            name: "Product",
                        },
                    },
                },
            },
            {
                header: {
                    attributeHeaderItem: {
                        uri: "/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/323/elements?id=2010",
                        name: "2010",
                    },
                    attributeHeader: {
                        uri: "/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/324",
                        identifier: "closed.aag81lMifn6q",
                        localIdentifier: "a3",
                        name: "Closed",
                        formOf: {
                            uri: "/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/323",
                            identifier: "closed",
                            name: "Closed",
                        },
                    },
                },
            },
        ];
        const pointsWithEmptyValues: Array<Partial<IHighchartsPointObject>> = [
            { x: 0, y: 0, value: 268.8, drillIntersection: drillIntersections },
            { x: 0, y: 1, value: null, drillIntersection: drillIntersections },
            {
                x: 0,
                y: 1,
                value: null,
                drillIntersection: drillIntersections,
                ignoredInDrillEventContext: true,
            },
            { x: 0, y: 2, value: null, drillIntersection: drillIntersections },
            {
                x: 0,
                y: 2,
                value: null,
                drillIntersection: drillIntersections,
                ignoredInDrillEventContext: true,
            },
            { x: 0, y: 3, value: 3644, drillIntersection: drillIntersections },
        ];
        const pointClickWithEmptyEventData: Highcharts.DrilldownEventObject = {
            points: pointsWithEmptyValues,
        } as any;

        const drillConfig = { afm, onFiredDrillEvent: () => true };
        const target = { dispatchEvent: jest.fn() };

        const expectedLegacyIntersectionWithEmptyValues: IDrillEventIntersectionElement[] = [
            {
                id: "1deea80aa5a54d1bbbc2e2de63989eef",
                title: "Best Case",
                header: {
                    uri: "/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/1282",
                    identifier: "ac3EwmqvbxcX",
                },
            },
            {
                id: "168279",
                title: "CompuSci",
                header: {
                    uri: "/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/952",
                    identifier: "label.product.id.name",
                },
            },
            {
                id: "2010",
                title: "2010",
                header: {
                    uri: "/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/324",
                    identifier: "closed.aag81lMifn6q",
                },
            },
        ];

        chartClick(
            drillConfig,
            pointClickWithEmptyEventData,
            (target as any) as EventTarget,
            VisualizationTypes.HEATMAP,
        );

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail.drillContext.points).toEqual([
            {
                intersection: expectedLegacyIntersectionWithEmptyValues,
                x: 0,
                y: 0,
            },
            {
                intersection: expectedLegacyIntersectionWithEmptyValues,
                x: 0,
                y: 1,
            },
            {
                intersection: expectedLegacyIntersectionWithEmptyValues,
                x: 0,
                y: 2,
            },
            {
                intersection: expectedLegacyIntersectionWithEmptyValues,
                x: 0,
                y: 3,
            },
        ]);
    });

    it("should correctly handle z coordinate of point", () => {
        const drillConfig = { afm, onFiredDrillEvent: () => true };
        const target = { dispatchEvent: jest.fn() };
        const pointClickWithZEventData = cloneDeep(pointClickEventData);

        pointClickWithZEventData.point.z = 12000;

        chartClick(
            drillConfig,
            pointClickWithZEventData,
            (target as any) as EventTarget,
            VisualizationTypes.BUBBLE,
        );

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual({
            executionContext: afm,
            drillContext: {
                type: "bubble",
                element: "point",
                x: 1,
                y: 2,
                z: 12000,
                intersection: expectedLegacyIntersection,
            },
        });
    });

    it("should call user defined callbacks on point click", () => {
        const drillConfig = { afm, onFiredDrillEvent: jest.fn(), onDrill: jest.fn() };
        const target = { dispatchEvent: () => true };

        chartClick(drillConfig, pointClickEventData, (target as any) as EventTarget, VisualizationTypes.LINE);

        jest.runAllTimers();

        expect(drillConfig.onFiredDrillEvent).toHaveBeenCalled();
        expect(drillConfig.onDrill).toHaveBeenCalled();
    });

    it("should call both default fire event and user defined callback on point click", () => {
        const drillConfig = { afm, onFiredDrillEvent: jest.fn() };
        const target = { dispatchEvent: jest.fn() };

        chartClick(drillConfig, pointClickEventData, (target as any) as EventTarget, VisualizationTypes.LINE);

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();
        expect(drillConfig.onFiredDrillEvent).toHaveBeenCalled();
    });

    it("should only call user defined callback on point click", () => {
        const drillConfig = { afm, onFiredDrillEvent: jest.fn().mockReturnValue(false) };
        const target = { dispatchEvent: jest.fn() };

        chartClick(drillConfig, pointClickEventData, (target as any) as EventTarget, VisualizationTypes.LINE);

        jest.runAllTimers();

        expect(target.dispatchEvent).not.toHaveBeenCalled();
        expect(drillConfig.onFiredDrillEvent).toHaveBeenCalled();
    });

    it("should call fire event on label click", () => {
        const drillConfig = { afm: simpleAfm, onFiredDrillEvent: () => true };
        const target = { dispatchEvent: jest.fn() };
        const clickedPoint: Partial<IHighchartsPointObject> = {
            x: 1,
            y: 2,
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
            ],
        };
        const labelClickEventData = ({
            points: [clickedPoint],
        } as any) as Highcharts.DrilldownEventObject;

        chartClick(drillConfig, labelClickEventData, (target as any) as EventTarget, VisualizationTypes.LINE);

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual({
            executionContext: {
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
            },
            drillContext: {
                type: "line",
                element: "label",
                points: [
                    {
                        x: 1,
                        y: 2,
                        intersection: [expectedLegacyIntersection[0]],
                    },
                ],
            },
        });
    });

    it("should call fire event on cell click", () => {
        const drillConfig = { afm: simpleAfm, onFiredDrillEvent: () => true };
        const target = { dispatchEvent: jest.fn() };
        const cellClickEventData = {
            columnIndex: 1,
            rowIndex: 2,
            row: ["3"],
            intersection: [
                {
                    id: "id1",
                    title: "title1",
                    header: {
                        identifier: "identifier1",
                        uri: "uri1",
                    },
                },
            ],
        };

        cellClick(drillConfig, cellClickEventData, (target as any) as EventTarget);

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual({
            executionContext: simpleAfm,
            drillContext: {
                type: "table",
                element: "cell",
                columnIndex: 1,
                rowIndex: 2,
                row: ["3"],
                intersection: [
                    {
                        id: "id1",
                        title: "title1",
                        header: {
                            identifier: "identifier1",
                            uri: "uri1",
                        },
                    },
                ],
            },
        });
    });

    describe("createDrillIntersectionElement", () => {
        it("should return empty id when id not provided", () => {
            const element = createDrillIntersectionElement(undefined, "title");

            expect(element).toEqual({
                id: "",
                title: "title",
            });
        });

        it("should return empty title when title not provided", () => {
            const element = createDrillIntersectionElement("id", undefined);

            expect(element).toEqual({
                id: "id",
                title: "",
            });
        });

        it("should return intersection element with only id and title when no uri and identifier provided", () => {
            const element = createDrillIntersectionElement("id", "title");

            expect(element).toEqual({
                id: "id",
                title: "title",
            });
        });

        it("should return intersection element with header", () => {
            const element = createDrillIntersectionElement("id", "title", "uri", "identifier");

            expect(element).toEqual({
                id: "id",
                title: "title",
                header: {
                    uri: "uri",
                    identifier: "identifier",
                },
            });
        });

        // tslint:disable-next-line:max-line-length
        it("should return intersection element with header with uri and empty identifier when only uri provided", () => {
            const element = createDrillIntersectionElement("id", "title", "uri");

            expect(element).toEqual({
                id: "id",
                title: "title",
                header: {
                    uri: "uri",
                    identifier: "",
                },
            });
        });

        // tslint:disable-next-line:max-line-length
        it("should return intersection element with header with identifier and empty uri when only identifier provided", () => {
            const element = createDrillIntersectionElement("id", "title", undefined, "identifier");

            expect(element).toEqual({
                id: "id",
                title: "title",
                header: {
                    uri: "",
                    identifier: "identifier",
                },
            });
        });

        it("should fire drill event (non-group) when point value is null and return empty string for value", () => {
            const drillConfig = { afm, onFiredDrillEvent: jest.fn() };
            const target = { dispatchEvent: jest.fn() };
            const pointClickEventDataWithPointNullValue: Highcharts.DrilldownEventObject = {
                ...pointClickEventData,
                points: null,
            };

            pointClickEventDataWithPointNullValue.point.value = null;

            chartClick(
                drillConfig,
                pointClickEventDataWithPointNullValue,
                (target as any) as EventTarget,
                VisualizationTypes.HEATMAP,
            );

            jest.runAllTimers();

            const drillContext = target.dispatchEvent.mock.calls[0][0].detail.drillContext;
            expect(drillContext.value).toEqual("");
            expect(drillConfig.onFiredDrillEvent).toHaveBeenCalled();
        });
    });

    describe("Drilling in Combo chart", () => {
        const columnPoint: IHighchartsPointObject = {
            ...point,
            series: { type: SeriesChartTypes.COLUMN },
        } as any;

        const drillIntersection: IDrillEventIntersectionElementExtended[] = [
            {
                header: {
                    measureHeaderItem: {
                        uri: "uri4",
                        identifier: "identifier4",
                        localIdentifier: "id4",
                        name: "title4",
                        format: "",
                    },
                },
            },
            {
                header: {
                    measureHeaderItem: {
                        uri: "uri5",
                        identifier: "identifier5",
                        localIdentifier: "id5",
                        name: "title5",
                        format: "",
                    },
                },
            },
            {
                header: {
                    measureHeaderItem: {
                        uri: "uri6",
                        identifier: "identifier6",
                        localIdentifier: "id6",
                        name: "title6",
                        format: "",
                    },
                },
            },
        ];

        const linePoint: Partial<IHighchartsPointObject> = {
            ...point,
            x: 2,
            y: 3,
            series: { type: SeriesChartTypes.LINE },
            drillIntersection,
        } as any;

        const lineAfm: AFM.IAfm = {
            measures: [
                {
                    localIdentifier: "id4",
                    definition: {
                        measure: {
                            item: {
                                uri: "uri4",
                            },
                        },
                    },
                },
                {
                    localIdentifier: "id5",
                    definition: {
                        measure: {
                            item: {
                                uri: "uri5",
                            },
                        },
                    },
                },
                {
                    localIdentifier: "id6",
                    definition: {
                        measure: {
                            item: {
                                uri: "uri6",
                            },
                        },
                    },
                },
            ],
        };

        const comboAfm = {
            measures: [...afm.measures, ...lineAfm.measures],
        };

        const expectedLinePointIntersection = [
            {
                id: "id4",
                title: "title4",
                header: {
                    identifier: "identifier4",
                    uri: "uri4",
                },
            },
            {
                id: "id5",
                title: "title5",
                header: {
                    identifier: "identifier5",
                    uri: "uri5",
                },
            },
            {
                id: "id6",
                title: "title6",
                header: {
                    identifier: "identifier6",
                    uri: "uri6",
                },
            },
        ];

        it("should return chart type for each point", () => {
            const drillConfig: IDrillConfig = { afm: comboAfm, onFiredDrillEvent: jest.fn() };
            const target: any = { dispatchEvent: jest.fn() };
            const pointClickEventData: Highcharts.DrilldownEventObject = {
                point: columnPoint,
                points: [columnPoint, linePoint],
            } as any;

            chartClick(drillConfig, pointClickEventData, target as EventTarget, VisualizationTypes.COMBO2);

            jest.runAllTimers();

            const drillContext = target.dispatchEvent.mock.calls[0][0].detail.drillContext;

            expect(drillConfig.onFiredDrillEvent).toHaveBeenCalled();
            expect(drillContext).toEqual({
                type: VisualizationTypes.COMBO,
                element: "label",
                points: [
                    {
                        x: columnPoint.x,
                        y: columnPoint.y,
                        intersection: expectedLegacyIntersection,
                        type: SeriesChartTypes.COLUMN,
                    },
                    {
                        x: linePoint.x,
                        y: linePoint.y,
                        intersection: expectedLinePointIntersection,
                        type: SeriesChartTypes.LINE,
                    },
                ],
            });
        });

        it("should fire event on cell click and fire correct data", () => {
            const drillConfig: IDrillConfig = { afm: lineAfm, onFiredDrillEvent: () => true };
            const target: any = { dispatchEvent: jest.fn() };
            const pointClickEventData: Highcharts.DrilldownEventObject = {
                point: linePoint,
                points: null,
            } as any;

            const expectedLegacyIntersection: IDrillEventIntersectionElement[] = [
                {
                    id: "id4",
                    title: "title4",
                    header: {
                        uri: "uri4",
                        identifier: "identifier4",
                    },
                },
                {
                    id: "id5",
                    title: "title5",
                    header: {
                        uri: "uri5",
                        identifier: "identifier5",
                    },
                },
                {
                    id: "id6",
                    title: "title6",
                    header: {
                        uri: "uri6",
                        identifier: "identifier6",
                    },
                },
            ];

            chartClick(drillConfig, pointClickEventData, target as EventTarget, VisualizationTypes.COMBO2);

            jest.runAllTimers();

            expect(target.dispatchEvent).toHaveBeenCalled();
            expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual({
                executionContext: lineAfm,
                drillContext: {
                    type: VisualizationTypes.COMBO,
                    element: "point",
                    elementChartType: SeriesChartTypes.LINE,
                    x: linePoint.x,
                    y: linePoint.y,
                    intersection: expectedLegacyIntersection,
                },
            });
        });

        it("should NOT add chart type for each point if it is not Combo chart", () => {
            const drillConfig: IDrillConfig = { afm, onFiredDrillEvent: jest.fn() };
            const target: any = { dispatchEvent: jest.fn() };
            const pointClickEventData: Highcharts.DrilldownEventObject = {
                point: columnPoint,
                points: [columnPoint],
            } as any;
            chartClick(drillConfig, pointClickEventData, target as EventTarget, VisualizationTypes.COLUMN);

            jest.runAllTimers();

            const drillContext = target.dispatchEvent.mock.calls[0][0].detail.drillContext;

            expect(drillConfig.onFiredDrillEvent).toHaveBeenCalled();
            expect(drillContext).toEqual({
                type: VisualizationTypes.COLUMN,
                element: "label",
                points: [
                    {
                        x: columnPoint.x,
                        y: columnPoint.y,
                        intersection: expectedLegacyIntersection,
                    },
                ],
            });
        });

        it("should NOT add elementChartType on cell click if it is not Combo chart", () => {
            const drillConfig: IDrillConfig = { afm: lineAfm, onFiredDrillEvent: () => true };
            const target: any = { dispatchEvent: jest.fn() };
            const pointClickEventData: Highcharts.DrilldownEventObject = {
                point: linePoint,
                points: null,
            } as any;

            chartClick(drillConfig, pointClickEventData, target as EventTarget, VisualizationTypes.LINE);

            jest.runAllTimers();

            expect(target.dispatchEvent).toHaveBeenCalled();
            expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual({
                executionContext: lineAfm,
                drillContext: {
                    type: VisualizationTypes.LINE,
                    element: "point",
                    x: linePoint.x,
                    y: linePoint.y,
                    intersection: expectedLinePointIntersection,
                },
            });
        });
    });

    describe("convertHeadlineDrillIntersectionToLegacy", () => {
        it("should handle empty intersection", () => {
            expect(convertHeadlineDrillIntersectionToLegacy([], afm)).toEqual([]);
        });

        it("should convert IMeasureHeaderItem in extended selection", () => {
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
            expect(convertHeadlineDrillIntersectionToLegacy([drillIntersectionExtended], afm)).toEqual(
                expectedIntersection,
            );
        });
    });

    describe("getDrillIntersection", () => {
        const measureHeader1: IMappingHeader = {
            measureHeaderItem: {
                localIdentifier: "l1",
                name: "name1",
                format: "format1",
            },
        };
        const measureHeader2: IMappingHeader = {
            measureHeaderItem: {
                localIdentifier: "l2",
                name: "name2",
                format: "format2",
            },
        };

        const attributeHeader: IMappingHeader = {
            attributeHeader: {
                uri: "uri.a1",
                identifier: "id.a1",
                localIdentifier: "local.a1",
                name: "name.a1",
                formOf: {
                    uri: "uri.f.a1",
                    identifier: "id.f.a1",
                    name: "name.f.a1",
                },
            },
        };

        const attributeHeaderItem: IMappingHeader = {
            attributeHeaderItem: {
                uri: "uri.a1.item",
                name: "name.a1.item",
            },
        };

        it("should correctly join attribute items with attributes", () => {
            expect(getDrillIntersection([attributeHeaderItem, attributeHeader])).toEqual([
                {
                    header: {
                        ...attributeHeaderItem,
                        ...attributeHeader,
                    },
                },
            ]);
        });

        it("should keep metric headers in drill items and wrap them in 'header'", () => {
            expect(getDrillIntersection([measureHeader1, measureHeader2])).toEqual([
                {
                    header: measureHeader1,
                },
                {
                    header: measureHeader2,
                },
            ]);
        });

        describe("for table", () => {
            const intl = createIntlMock();
            const { columnDefs, rowData } = executionToAGGridAdapter(
                {
                    executionResponse: pivotTableWithColumnAndRowAttributes.executionResponse,
                    executionResult: pivotTableWithColumnAndRowAttributes.executionResult,
                },
                {},
                intl,
            );
            it("should return intersection of row attribute and row attribute value for row header cell", async () => {
                const rowColDef = columnDefs[0]; // row header
                const drillItems = [rowData[0].headerItemMap[rowColDef.field], ...rowColDef.drillItems];
                const intersection = getDrillIntersection(drillItems);
                expect(intersection).toEqual([
                    {
                        header: {
                            ...drillItems[0],
                            ...drillItems[1],
                        },
                    },
                ]);
            });

            it("should return intersection of all column header attributes and values and a measure for column header cell", async () => {
                const colDef = getTreeLeaves(columnDefs)[3]; // column leaf header
                const intersection = getDrillIntersection(colDef.drillItems);
                expect(intersection).toEqual([
                    {
                        header: {
                            ...colDef.drillItems[0],
                            ...colDef.drillItems[1],
                        },
                    },
                    {
                        header: {
                            ...colDef.drillItems[2],
                            ...colDef.drillItems[3],
                        },
                    },
                    {
                        header: colDef.drillItems[4],
                    },
                ]);
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
                const intersection = getDrillIntersection(drillItems);
                expect(intersection).toEqual([
                    {
                        header: drillItems[0],
                    },
                ]);
            });
        });
    });
});
