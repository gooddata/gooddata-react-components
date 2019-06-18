// (C) 2007-2019 GoodData Corporation
import * as autohideColumnLabels from "../autohideColumnLabels";
import {
    IPointData,
    IDataLabelsConfig,
    IAxisConfig,
    ISeriesDataItem,
} from "../../../../../../../interfaces/Config";
import { VisualizationTypes } from "../../../../../../../constants/visualizationTypes";

describe("getStackLabelPointsForDualAxis", () => {
    it("should return points for column0 and column", () => {
        const stacks: any[] = [
            { column0: { 0: { x: 0, total: 678 }, 1: { x: 1, total: 958 } } },
            { column: { 0: { x: 0, total: 907 }, 1: { x: 1, total: 525 } } },
        ];
        const points = autohideColumnLabels.getStackLabelPointsForDualAxis(stacks);

        expect(points).toEqual([
            stacks[0].column0[0],
            stacks[1].column[0],
            stacks[0].column0[1],
            stacks[1].column[1],
        ]);
    });

    it("should return points for column0 and column1", () => {
        const stacks: any[] = [
            { column0: { 0: { x: 0, total: 678 }, 1: { x: 1, total: 958 } } },
            { column1: { 0: { x: 0, total: 907 }, 1: { x: 1, total: 525 } } },
        ];
        const points = autohideColumnLabels.getStackLabelPointsForDualAxis(stacks);

        expect(points).toEqual([
            stacks[0].column0[0],
            stacks[1].column1[0],
            stacks[0].column0[1],
            stacks[1].column1[1],
        ]);
    });
});

describe("isOverlappingWidth", () => {
    const visiblePointsWithoutShape: IPointData[] = [
        {
            x: 0,
            dataLabel: {
                width: 98,
                padding: 2,
            },
        },
    ];

    it("should return true when point has datalabel width greater than shape width", () => {
        const visiblePointsWithShape: IPointData[] = [
            {
                ...visiblePointsWithoutShape[0],
                shapeArgs: {
                    width: 100,
                },
            },
        ];
        expect(autohideColumnLabels.isOverlappingWidth(visiblePointsWithShape)).toEqual(true);
    });

    it("should return false when point has datalabel width less than shape width", () => {
        const visiblePointsWithShape: IPointData[] = [
            {
                ...visiblePointsWithoutShape[0],
                shapeArgs: {
                    width: 105,
                },
            },
        ];
        expect(autohideColumnLabels.isOverlappingWidth(visiblePointsWithShape)).toEqual(false);
    });

    it("should return false when shapeArgs is undefined", () => {
        expect(autohideColumnLabels.isOverlappingWidth(visiblePointsWithoutShape)).toEqual(false);
    });
});

describe("getLabelOrDataLabelForPoints", () => {
    const label: IDataLabelsConfig = {
        width: 98,
        padding: 1,
    };
    const dataLabel: IDataLabelsConfig = {
        width: 100,
        padding: 10,
    };
    const visiblePoints: IPointData[] = [
        {
            x: 0,
            y: 1,
        },
        {
            x: 0,
            y: 2,
            label,
        },
        {
            x: 0,
            y: 3,
            dataLabel,
        },
    ];

    it.each([
        [visiblePoints, [label, dataLabel]],
        [[{ ...visiblePoints[0] }, { ...visiblePoints[1] }], [label]],
        [
            [
                {
                    ...visiblePoints[0],
                },
                { ...visiblePoints[2] },
            ],
            [dataLabel],
        ],
    ])("should return label/dataLabel of data points", (visiblePoints, expected) => {
        const labels = autohideColumnLabels.getLabelOrDataLabelForPoints(visiblePoints);
        expect(labels).toEqual(expected);
    });
});

describe("getStackTotalGroups", () => {
    it("should return stack total group", () => {
        const stackTotalGroup: Highcharts.SVGAttributes = {
            translateX: 51,
            translateY: 20,
            zIndex: 6,
        };
        const yAxis: IAxisConfig[] = [
            {
                stacks: { column0: [{ x: 0, total: 678 }, { x: 1, total: 958 }] },
                stackTotalGroup,
            },
        ] as any;
        const stackLabels = autohideColumnLabels.getStackTotalGroups(yAxis);

        expect(stackLabels).toEqual([stackTotalGroup]);
    });

    it("should return data labels group", () => {
        const dataLabelsGroup: Highcharts.SVGAttributes = {
            translateX: 51,
            translateY: 20,
            zIndex: 6,
        };
        const yAxis: IAxisConfig[] = [
            {
                stacks: {},
                series: [{ dataLabelsGroup }],
            },
        ];
        const stackLabels = autohideColumnLabels.getStackTotalGroups(yAxis);

        expect(stackLabels).toEqual([dataLabelsGroup]);
    });
});

describe("getStackItems", () => {
    it("should return stack items", () => {
        const yAxis: IAxisConfig[] = [
            {
                stacks: { column0: [{ x: 0, total: 678 }, { x: 1, total: 958 }] },
            },
        ] as any[];
        const stackItems = autohideColumnLabels.getStackItems(yAxis);

        expect(stackItems).toEqual([yAxis[0].stacks]);
    });

    it("should return data label items", () => {
        const data: ISeriesDataItem[] = [{ x: 6, y: 7 }, { x: 8, y: 9 }];
        const yAxis: IAxisConfig[] = [
            {
                stacks: {},
                series: [{ data, type: VisualizationTypes.COLUMN }],
            },
        ];
        const stackItems = autohideColumnLabels.getStackItems(yAxis);

        expect(stackItems).toEqual([
            {
                column: {
                    0: data[0],
                    1: data[1],
                },
            },
        ]);
    });
});

describe("areNeighborsOverlapping", () => {
    const clientRect = [{ width: 100, x: 10 }, { width: 101, x: 100 }, { width: 102, x: 250 }];
    function getElement(index: number) {
        return {
            getBoundingClientRect: () => {
                return clientRect[index];
            },
        };
    }
    const overlaplabels: IDataLabelsConfig[][] = [
        [{ element: getElement(0) }, { element: getElement(1) }],
    ] as any[];
    const withoutOverlapLabel: IDataLabelsConfig[][] = [
        [{ element: getElement(1) }, { element: getElement(2) }],
    ] as any;
    it.each([[true, overlaplabels], [false, withoutOverlapLabel]])(
        "should return overlap is %s",
        (isOverlap: number, labels: IDataLabelsConfig[][]) => {
            const areNeighborsOverlapping = autohideColumnLabels.areNeighborsOverlapping(labels);
            expect(areNeighborsOverlapping).toEqual(isOverlap);
        },
    );
});
