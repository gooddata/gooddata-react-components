// (C) 2019 GoodData Corporation
import * as BucketNames from "../../../../constants/bucketNames";
import { IBucket, ICustomError, IReferencePoint } from "../../../interfaces/Visualization";
import { getCustomError } from "../xirrUiConfigHelper";
import * as referencePointMocks from "../../../mocks/referencePointMocks";

describe("getCustomError", () => {
    const validMeasureBucket: IBucket = {
        localIdentifier: BucketNames.MEASURES,
        items: [referencePointMocks.masterMeasureItems[0]],
    };

    const emptyMeasureBucket: IBucket = {
        localIdentifier: BucketNames.MEASURES,
        items: [],
    };

    const validAttributeBucket: IBucket = {
        localIdentifier: BucketNames.ATTRIBUTE,
        items: [referencePointMocks.dateItem],
    };

    const emptyAttributeBucket: IBucket = {
        localIdentifier: BucketNames.ATTRIBUTE,
        items: [],
    };

    const getReferencePoint = (buckets: IBucket[]): IReferencePoint => ({
        buckets,
        filters: {
            items: [],
            localIdentifier: "filters",
        },
    });
    const mockFormatMessage = ({ id }: { id: string }) => id;
    const expectedError: ICustomError = {
        heading: "dashboard.xirr.error.invalid_buckets.heading",
        text: "dashboard.xirr.error.invalid_buckets.text",
    };

    it("should return undefined if everything is OK", () => {
        const buckets = [validMeasureBucket, validAttributeBucket];
        const input = getReferencePoint(buckets);
        const actual = getCustomError(input, mockFormatMessage);

        expect(actual).toBeUndefined();
    });

    it.each([
        ["attribute bucket is missing", [validMeasureBucket]],
        ["attribute bucket is empty", [validMeasureBucket, emptyAttributeBucket]],
        ["measure bucket is missing", [validAttributeBucket]],
        ["measure bucket is empty", [validAttributeBucket, emptyMeasureBucket]],
    ])("should return an error when %s", (_, buckets: IBucket[]) => {
        const input = getReferencePoint(buckets);
        const actual = getCustomError(input, mockFormatMessage);

        expect(actual).toEqual(expectedError);
    });
});
