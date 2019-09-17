// (C) 2007-2019 GoodData Corporation
import * as moment from "moment";
import isDate from "lodash/isDate";
import isString from "lodash/isString";
import { ExtendedDateFilters } from "@gooddata/typings";

import { IDateRange } from "../DateRangePicker/DateRangePicker";
import { platformDateFormat } from "../../../../constants/Platform";

const convertDateToPlatformDate = (date: Date | undefined | null): string | undefined | null =>
    isDate(date) ? moment(date).format(platformDateFormat) : date;

const convertPlatformDateToDate = (platformDate: string | undefined | null): Date | undefined | null =>
    isString(platformDate) ? moment(platformDate).toDate() : platformDate;

export const dateRangeToDateFilterValue = (
    range: IDateRange,
    localIdentifier: string,
): ExtendedDateFilters.IAbsoluteDateFilterForm => ({
    // GD Platform doesn't support time here
    from: convertDateToPlatformDate(range.from),
    to: convertDateToPlatformDate(range.to),
    localIdentifier,
    type: "absoluteForm",
    name: "",
    visible: true,
});

export const dateFilterValueToDateRange = (
    value: ExtendedDateFilters.IAbsoluteDateFilterForm,
): IDateRange => ({
    from: value && convertPlatformDateToDate(value.from),
    to: value && convertPlatformDateToDate(value.to),
});
