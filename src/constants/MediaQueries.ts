// (C) 2007-2019 GoodData Corporation

// TODO ONE-4000 Moved from SDK

const SCREEN = "only screen";

const ZERO_BREAKPOINT = 0;
export const XSMALL_BREAKPOINT = 320;
export const SMALL_BREAKPOINT = 640;
const MEDIUM_BREAKPOINT = 940;
export const LARGE_BREAKPOINT = 1170;
export const XLARGE_BREAKPOINT = 1590;
const XXLARGE_BREAKPOINT = 99999999;

interface IMatchingRange {
    upper: number;
    lower: number;
}

const smallRange: IMatchingRange = {
    lower: ZERO_BREAKPOINT,
    upper: SMALL_BREAKPOINT,
};

const mediumRange: IMatchingRange = {
    lower: SMALL_BREAKPOINT + 1,
    upper: MEDIUM_BREAKPOINT,
};

const largeRange: IMatchingRange = {
    lower: MEDIUM_BREAKPOINT + 1,
    upper: LARGE_BREAKPOINT,
};

const xlargeRange: IMatchingRange = {
    lower: LARGE_BREAKPOINT + 1,
    upper: XLARGE_BREAKPOINT,
};

const xxlargeRange: IMatchingRange = {
    lower: XLARGE_BREAKPOINT + 1,
    upper: XXLARGE_BREAKPOINT,
};

const getQueryMatching = (range: IMatchingRange) =>
    `${SCREEN} and (min-width:${range.lower}px) and (max-width:${range.upper}px)`;
const getQueryMatchingOrGreater = (range: IMatchingRange) => `${SCREEN} and (min-width:${range.lower}px)`;

export const IS_SMALL_UP = getQueryMatchingOrGreater(smallRange);
export const IS_SMALL_ONLY = getQueryMatching(smallRange);
export const IS_MEDIUM_UP = getQueryMatchingOrGreater(mediumRange);
export const IS_MEDIUM_ONLY = getQueryMatching(mediumRange);
export const IS_LARGE_UP = getQueryMatchingOrGreater(largeRange);
export const IS_LARGE_ONLY = getQueryMatching(largeRange);
export const IS_XLARGE_UP = getQueryMatchingOrGreater(xlargeRange);
export const IS_XLARGE_ONLY = getQueryMatching(xlargeRange);
export const IS_XXLARGE_UP = getQueryMatchingOrGreater(xxlargeRange);
export const IS_XXLARGE_ONLY = getQueryMatching(xxlargeRange);

// custom queries
const mobileRange = smallRange;
const notMobileRange: IMatchingRange = {
    lower: mediumRange.lower,
    upper: xxlargeRange.upper,
};
export const IS_MOBILE_DEVICE = getQueryMatching(mobileRange);
export const IS_NOT_MOBILE_DEVICE = getQueryMatching(notMobileRange);

const desktopRange: IMatchingRange = {
    lower: LARGE_BREAKPOINT + 1,
    upper: XXLARGE_BREAKPOINT,
};
const smallerThanDesktop: IMatchingRange = {
    lower: ZERO_BREAKPOINT,
    upper: LARGE_BREAKPOINT,
};
export const IS_DESKTOP = getQueryMatching(desktopRange);
export const IS_SMALLER_THAN_DESKTOP = getQueryMatching(smallerThanDesktop);
