// (C) 2019 GoodData Corporation
import { getQualifier, getObjQualifier } from "../utils";

describe("Utils", () => {
    describe("getObjQualifier", () => {
        it("should return a localIdentifier qualifier", () => {
            expect(getObjQualifier("identifier")).toEqual({
                identifier: "identifier",
            });
        });

        it("should return an uri qualifier", () => {
            expect(getObjQualifier("/gdc/md/123/obj/123")).toEqual({
                uri: "/gdc/md/123/obj/123",
            });
        });
    });

    describe("getQualifier", () => {
        it("should return a localIdentifier qualifier", () => {
            expect(getQualifier("identifier")).toEqual({
                localIdentifier: "identifier",
            });
        });

        it("should return an uri qualifier", () => {
            expect(getQualifier("/gdc/md/123/obj/123")).toEqual({
                uri: "/gdc/md/123/obj/123",
            });
        });
    });
});
