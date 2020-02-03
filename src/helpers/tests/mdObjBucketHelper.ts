// (C) 2020 GoodData Corporation
import { filterOutEmptyBuckets } from "../mdObjBucketHelper";

import { measures } from "../../../__mocks__/fixtures";

describe("filterOutEmptyBuckets", () => {
    it("should return only buckets with some items", () => {
        const buckets = [
            {
                localIdentifier: "measures",
                items: measures.slice(0),
            },
            {
                localIdentifier: "secondary_measures",
                items: [],
            },
        ];
        const expectedBuckets = [buckets[0]];

        expect(filterOutEmptyBuckets(buckets)).toStrictEqual(expectedBuckets);
    });
});
