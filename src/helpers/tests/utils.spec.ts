// (C) 2007-2020 GoodData Corporation
import {
    getObjectIdFromUri,
    setTelemetryHeaders,
    percentFormatter,
    unwrap,
    getMinMax,
    shouldShowFluid,
} from "../utils";
import { factory as createSdk } from "@gooddata/gooddata-js";
import { FLUID_LEGEND_THRESHOLD } from "../../constants/legend";

describe("getObjectIdFromUri", () => {
    it("should extract object id from uris", () => {
        expect(getObjectIdFromUri("/gdc/md/aadsf234234234324/obj/ABC")).toBe("ABC");
        expect(getObjectIdFromUri("/gdc/md/aadsf234234234324/obj/123/sdfghjkhgfd")).toBe("123");
        expect(getObjectIdFromUri("/gdc/md/aadsf234234234324/obj/DEF_456?XXX")).toBe("DEF_456");
    });

    it("should return null if it cannot find the uri", () => {
        expect(getObjectIdFromUri("/uri/without/objectId")).toBe(null);
    });
});

describe("setTelemetryHeaders", () => {
    it("should set telemetry headers", () => {
        const sdk = createSdk();
        setTelemetryHeaders(sdk, "componentName", { prop: "value" });

        expect(sdk.config.getJsPackage()).toMatchObject({
            name: "@gooddata/react-components",
            version: expect.any(String),
        });

        expect(sdk.config.getRequestHeader("X-GDC-JS-SDK-COMP")).toEqual("componentName");
        expect(sdk.config.getRequestHeader("X-GDC-JS-SDK-COMP-PROPS")).toEqual("prop");
    });
});

describe("percentFormatter", () => {
    it.each([["0%", 0], ["49.01%", 49.01], ["100%", 100], ["", null]])(
        'should return "%s" when input is %s',
        (formattedValue: string, value: number) => {
            expect(percentFormatter(value)).toEqual(formattedValue);
        },
    );
});

describe("unwrap", () => {
    it("should unwrap an object", () => {
        expect(unwrap({ key: "value" })).toEqual("value");
    });
});

describe("getMinMax", () => {
    it("should return empty min/max", () => {
        const data: number[] = [NaN, null, undefined];
        expect(getMinMax(data)).toEqual({});
    });

    it("should return min/max", () => {
        const data: number[] = [100, 10, 0];
        expect(getMinMax(data)).toEqual({
            min: 0,
            max: 100,
        });
    });

    it("should return min/max with ignoring null or NaN values", () => {
        const data: number[] = [NaN, 100, 10, 0, null, undefined];
        expect(getMinMax(data)).toEqual({
            min: 0,
            max: 100,
        });
    });

    it("should return min === max", () => {
        const data: number[] = [NaN, null, undefined, 0, 0];
        expect(getMinMax(data)).toEqual({ min: 0, max: 0 });
    });

    it("should return min/max with negative value", () => {
        const data: number[] = [NaN, 100, 10, 0, null, undefined, -50, -100];
        expect(getMinMax(data)).toEqual({
            min: -100,
            max: 100,
        });
    });
});

describe("shouldShowFluid", () => {
    it("should return false with empty Object", () => {
        expect(shouldShowFluid(undefined)).toEqual(false);
    });

    it("should return false with clientWidth great than FLUID_LEGEND_THRESHOLD", () => {
        const documentObj: any = {
            documentElement: {
                clientWidth: FLUID_LEGEND_THRESHOLD + 10,
            },
        };
        expect(shouldShowFluid(documentObj)).toEqual(false);
    });

    it("should return true with clientWidth less than FLUID_LEGEND_THRESHOLD", () => {
        const documentObj: any = {
            documentElement: {
                clientWidth: FLUID_LEGEND_THRESHOLD - 10,
            },
        };
        expect(shouldShowFluid(documentObj)).toEqual(true);
    });
});
