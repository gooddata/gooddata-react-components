// (C) 2007-2019 GoodData Corporation

export const InvalidTypeGuardInputTestCases: Array<[boolean, string, any]> = [
    [false, "null", null],
    [false, "undefined", undefined],
    [false, "empty object", {}],
    [false, "array", []],
    [false, "string", "bleh"],
    [false, "number", 42],
    [false, "boolean", true],
    [false, "function", () => false],
];
