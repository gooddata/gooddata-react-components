// (C) 2019 GoodData Corporation
import {
    convertDateToPlatformDateString,
    convertPlatformDateStringToDate,
    createDateFromString,
} from "../DateConversions";

describe("convertDateToPlatformDate", () => {
    it("should convert Date object to string in platform date", () => {
        const date = convertDateToPlatformDateString(new Date(2019, 11, 1));
        expect(date).toBe("2019-12-01");
    });

    it("should return undefined to undefined Date object", () => {
        const date = convertDateToPlatformDateString(undefined);
        expect(date).toBe(undefined);
    });

    it("should return null to null Date object", () => {
        const date = convertDateToPlatformDateString(null);
        expect(date).toBe(null);
    });
});

describe("convertPlatformDateStringToDate", () => {
    it("should convert platform date string to Date object", () => {
        const date = convertPlatformDateStringToDate("2019-12-01");
        expect(date.toISOString()).toBe(new Date(2019, 11, 1).toISOString());
    });

    it("should return undefined to undefined input value", () => {
        const date = convertPlatformDateStringToDate(undefined);
        expect(date).toBe(undefined);
    });

    it('should return null to null input value"', () => {
        const date = convertPlatformDateStringToDate(null);
        expect(date).toBe(null);
    });
});

describe("createDateFromString", () => {
    it("should convert platform date string to Date object", () => {
        const date = convertPlatformDateStringToDate("2019-12-01");
        expect(date.toISOString()).toBe(new Date(2019, 11, 1).toISOString());
    });

    it("should return undefined when input value is null", () => {
        const date = createDateFromString(null);
        expect(date).toBe(undefined);
    });

    it("should return undefined when input value is empty", () => {
        const date = createDateFromString("");
        expect(date).toBe(undefined);
    });
});
