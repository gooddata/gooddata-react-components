// (C) 2020 GoodData Corporation
import { Execution } from "@gooddata/typings";
import { IPushpinColor } from "../../../../interfaces/GeoChart";
import { getColorIndexInPalette, getColorPaletteMapping, getPushpinColors } from "../geoChartColor";

describe("getPushpinColors", () => {
    function createSegmentItems(count: number): Execution.IResultAttributeHeaderItem[] {
        return Array(count)
            .fill(0)
            .map(
                (_item: number, index: number): Execution.IResultAttributeHeaderItem => ({
                    attributeHeaderItem: {
                        uri: `uri_${index}`,
                        name: `name_${index}`,
                    },
                }),
            );
    }

    it("should return pushpin RGB colors", () => {
        const duplicatedSegmentItems: Execution.IResultAttributeHeaderItem[] = [
            ...createSegmentItems(5),
            ...createSegmentItems(5),
        ];
        const colors: number[] = [10, 20, 30, 40, 50, 10, 20, 30, 40, 50];
        const expectedColors: IPushpinColor[] = [
            { background: "rgb(215,242,250)", border: "rgb(20,178,226)" },
            { background: "rgb(127,224,198)", border: "rgb(0,193,141)" },
            { background: "rgb(237,136,129)", border: "rgb(229,77,66)" },
            { background: "rgb(241,134,0)", border: "rgb(241,134,0)" },
            { background: "rgb(171,85,163)", border: "rgb(171,85,163)" },
            { background: "rgb(215,242,250)", border: "rgb(20,178,226)" },
            { background: "rgb(127,224,198)", border: "rgb(0,193,141)" },
            { background: "rgb(237,136,129)", border: "rgb(229,77,66)" },
            { background: "rgb(241,134,0)", border: "rgb(241,134,0)" },
            { background: "rgb(171,85,163)", border: "rgb(171,85,163)" },
        ];
        expect(getPushpinColors(colors, duplicatedSegmentItems)).toEqual(expectedColors);
    });

    it("should return empty RGB colors when colors is empty", () => {
        expect(getPushpinColors([], undefined)).toEqual([]);
    });

    it("should return one RGB color when all colors having same values", () => {
        expect(getPushpinColors([10, 10], undefined)).toEqual([
            { background: "rgb(20,178,226)", border: "rgb(20,178,226)" },
        ]);
    });

    it("should return pushpin RGB colors with null value with segmentBy", () => {
        const segmentItems: Execution.IResultAttributeHeaderItem[] = createSegmentItems(5);
        const colors: number[] = [10, null, 30, 40, 50];
        const expectedColors: IPushpinColor[] = [
            { background: "rgb(215,242,250)", border: "rgb(20,178,226)" },
            { background: "rgb(212,244,236)", border: "rgb(0,193,141)" },
            { background: "rgb(237,136,129)", border: "rgb(229,77,66)" },
            { background: "rgb(241,134,0)", border: "rgb(241,134,0)" },
            { background: "rgb(171,85,163)", border: "rgb(171,85,163)" },
        ];
        expect(getPushpinColors(colors, segmentItems)).toEqual(expectedColors);
    });

    it("should return pushpin RGB colors with null value without segmentBy", () => {
        const colors: number[] = [10, null, 30, 40, 50];
        const expectedColors: IPushpinColor[] = [
            { background: "rgb(215,242,250)", border: "rgb(20,178,226)" },
            { background: "rgb(215,242,250)", border: "rgb(20,178,226)" },
            { background: "rgb(98,203,235)", border: "rgb(20,178,226)" },
            { background: "rgb(20,178,226)", border: "rgb(20,178,226)" },
            { background: "rgb(20,178,226)", border: "rgb(20,178,226)" },
        ];
        expect(getPushpinColors(colors, undefined)).toEqual(expectedColors);
    });

    it("should return pushpin RGB colors with null value with some null segmentBy items", () => {
        const colors: number[] = [10, null, 30, 40, null, null];
        const segmentItems: Execution.IResultAttributeHeaderItem[] = [
            ...createSegmentItems(2),
            ...createSegmentItems(2),
            {
                attributeHeaderItem: {
                    uri: "uri_5",
                    name: "",
                },
            },
            {
                attributeHeaderItem: {
                    uri: "uri_6",
                    name: undefined,
                },
            },
        ];
        const expectedColors: IPushpinColor[] = [
            { background: "rgb(215,242,250)", border: "rgb(20,178,226)" },
            { background: "rgb(212,244,236)", border: "rgb(0,193,141)" },
            { background: "rgb(59,190,230)", border: "rgb(20,178,226)" },
            { background: "rgb(0,193,141)", border: "rgb(0,193,141)" },
            { background: "rgb(250,225,223)", border: "rgb(229,77,66)" },
            { background: "rgb(250,225,223)", border: "rgb(229,77,66)" },
        ];
        expect(getPushpinColors(colors, segmentItems)).toEqual(expectedColors);
    });

    it("should return pushpin RGB colors with range of negative and positive and null values", () => {
        const colors: number[] = [null, -100, -50, 0, 50, 100, 200];
        const expectedColors: IPushpinColor[] = [
            { background: "rgb(215,242,250)", border: "rgb(20,178,226)" },
            { background: "rgb(215,242,250)", border: "rgb(20,178,226)" },
            { background: "rgb(176,229,245)", border: "rgb(20,178,226)" },
            { background: "rgb(137,216,240)", border: "rgb(20,178,226)" },
            { background: "rgb(98,203,235)", border: "rgb(20,178,226)" },
            { background: "rgb(59,190,230)", border: "rgb(20,178,226)" },
            { background: "rgb(20,178,226)", border: "rgb(20,178,226)" },
        ];
        expect(getPushpinColors(colors, [])).toEqual(expectedColors);
    });
});

describe("getColorPaletteMapping", () => {
    it("should return color palette mapping with one segment item", () => {
        expect(getColorPaletteMapping(["only_one_item"])).toEqual({
            only_one_item: [
                "rgb(215,242,250)",
                "rgb(176,229,245)",
                "rgb(137,216,240)",
                "rgb(98,203,235)",
                "rgb(59,190,230)",
                "rgb(20,178,226)",
            ],
        });
    });

    it("should return palette in first default color with no segment item", () => {
        expect(getColorPaletteMapping([])).toEqual({
            default_segment_item: [
                "rgb(215,242,250)",
                "rgb(176,229,245)",
                "rgb(137,216,240)",
                "rgb(98,203,235)",
                "rgb(59,190,230)",
                "rgb(20,178,226)",
            ],
        });
    });

    it("should return color palette mappings", () => {
        const segmentItems = Array(4)
            .fill("item")
            .map((item: string, index: number) => `${item}${index}`);
        expect(getColorPaletteMapping(segmentItems)).toEqual({
            item0: [
                "rgb(215,242,250)",
                "rgb(176,229,245)",
                "rgb(137,216,240)",
                "rgb(98,203,235)",
                "rgb(59,190,230)",
                "rgb(20,178,226)",
            ],
            item1: [
                "rgb(212,244,236)",
                "rgb(170,234,217)",
                "rgb(127,224,198)",
                "rgb(85,213,179)",
                "rgb(42,203,160)",
                "rgb(0,193,141)",
            ],
            item2: [
                "rgb(250,225,223)",
                "rgb(246,195,192)",
                "rgb(242,166,160)",
                "rgb(237,136,129)",
                "rgb(233,106,97)",
                "rgb(229,77,66)",
            ],
            item3: [
                "rgb(252,234,212)",
                "rgb(250,214,170)",
                "rgb(248,194,127)",
                "rgb(245,174,85)",
                "rgb(243,154,42)",
                "rgb(241,134,0)",
            ],
        });
    });

    it("should rotate to zero after 20 items", () => {
        const segmentItems = Array(21)
            .fill("item")
            .map((item: string, index: number) => `${item}${index}`);
        const mapping = getColorPaletteMapping(segmentItems);
        expect(mapping.item0).toEqual(mapping.item20);
    });
});

describe("getColorIndexInPalette", () => {
    it.each([[0, 100], [1, 120], [2, 220], [2, 300], [3, 312], [5, 700], [5, 800], [0, null]])(
        "should return %s",
        (expected: number, value: number) => {
            expect(getColorIndexInPalette(value, 100, 700)).toBe(expected);
        },
    );

    it("should return with negative color values", () => {
        expect(getColorIndexInPalette(-20, -100, -10)).toBe(5);
    });
});
