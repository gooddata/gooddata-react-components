// (C) 2019 GoodData Corporation
import { calculateXirr } from "../calculateXirr";

describe("calculateXirr", () => {
    it("should compute XIRR value for yearly input", () => {
        // source of data: https://en.wikipedia.org/wiki/Internal_rate_of_return
        const xirrInput = [
            { when: new Date("01/01/18"), amount: -123400 },
            { when: new Date("01/01/19"), amount: 36200 },
            { when: new Date("01/01/20"), amount: 54800 },
            { when: new Date("01/01/21"), amount: 48100 },
        ];

        const actual = calculateXirr(xirrInput);
        const expected = 0.05958953474733984;
        expect(actual).toEqual(expected);
    });

    it("should compute XIRR value for irregular input", () => {
        // source of data: https://support.office.com/en-us/article/xirr-function-de1242ec-6477-445b-b11b-a303ad9adc9d
        const xirrInput = [
            { when: new Date("01/01/08"), amount: -10000 },
            { when: new Date("03/01/08"), amount: 2750 },
            { when: new Date("10/30/08"), amount: 4250 },
            { when: new Date("02/15/09"), amount: 3250 },
            { when: new Date("04/01/09"), amount: 2750 },
        ];

        const actual = calculateXirr(xirrInput);
        const expected = 0.37336253350955556;
        expect(actual).toEqual(expected);
    });
});
