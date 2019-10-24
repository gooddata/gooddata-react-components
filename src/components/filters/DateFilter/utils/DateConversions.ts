// (C) 2019 GoodData Corporation
import * as moment from "moment";
import isString = require("lodash/isString");
import isDate = require("lodash/isDate");
import { platformDateFormat } from "../../../../constants/Platform";

export const convertDateToPlatformDateString = (date: Date | undefined | null): string | undefined | null =>
    isDate(date) ? moment(date).format(platformDateFormat) : date;

export const convertPlatformDateStringToDate = (
    platformDate: string | undefined | null,
): Date | undefined | null => (isString(platformDate) ? moment(platformDate).toDate() : platformDate);

export const createDateFromString = (dateString: string) => (dateString ? new Date(dateString) : undefined);
