// (C) 2019 GoodData Corporation
import { ExtendedDateFilters } from "@gooddata/typings";
import { sanitizeDateFilterOption } from "../DateFilterOptionSanitization";

describe("sanitizeDateFilterOption", () => {
    type TestCaseCollection<T> = Array<[string, T, T?]>;

    describe("absolute option sanitization", () => {
        const absoluteFormBase: ExtendedDateFilters.IAbsoluteDateFilterForm = {
            localIdentifier: "FOO",
            name: "Foo",
            type: "absoluteForm",
            visible: true,
        };

        const absoluteFormCases: TestCaseCollection<ExtendedDateFilters.IAbsoluteDateFilterForm> = [
            [
                "ordered bounds",
                { ...absoluteFormBase, from: "2019-01-01", to: "2019-01-31" },
                { ...absoluteFormBase, from: "2019-01-01", to: "2019-01-31" },
            ],
            [
                "equal bounds",
                { ...absoluteFormBase, from: "2019-01-01", to: "2019-01-01" },
                { ...absoluteFormBase, from: "2019-01-01", to: "2019-01-01" },
            ],
            [
                "unordered bounds",
                { ...absoluteFormBase, from: "2019-01-31", to: "2019-01-01" },
                { ...absoluteFormBase, from: "2019-01-01", to: "2019-01-31" },
            ],
        ];

        it.each(absoluteFormCases)("should sanitize absolute form with %s", (_, input, expected) => {
            expect(sanitizeDateFilterOption(input)).toEqual(expected);
        });
    });

    describe("relative option sanitization", () => {
        const relativeFormBase: ExtendedDateFilters.IRelativeDateFilterForm = {
            localIdentifier: "FOO",
            name: "Foo",
            type: "relativeForm",
            availableGranularities: ["GDC.time.date"],
            granularity: "GDC.time.date",
            visible: true,
        };

        const relativeFormCases: TestCaseCollection<ExtendedDateFilters.IRelativeDateFilterForm> = [
            [
                "ordered bounds",
                { ...relativeFormBase, from: 5, to: 10 },
                { ...relativeFormBase, from: 5, to: 10 },
            ],
            [
                "equal bounds",
                { ...relativeFormBase, from: 5, to: 5 },
                { ...relativeFormBase, from: 5, to: 5 },
            ],
            [
                "unordered bounds",
                { ...relativeFormBase, from: 10, to: 5 },
                { ...relativeFormBase, from: 5, to: 10 },
            ],
        ];

        it.each(relativeFormCases)("should sanitize relative form with %s", (_, input, expected) => {
            expect(sanitizeDateFilterOption(input)).toEqual(expected);
        });
    });
});
