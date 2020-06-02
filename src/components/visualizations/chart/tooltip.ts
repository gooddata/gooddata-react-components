// (C) 2007-2020 GoodData Corporation
import { colors2Object, INumberObject, ISeparators, numberFormat } from "@gooddata/numberjs";
import isNil = require("lodash/isNil");
import { customEscape } from "./chartOptionsBuilder";
import { percentFormatter } from "../../../helpers/utils";
import { IPointData } from "../../../interfaces/Config";

// in viewport <= 480, tooltip width is equal to chart container width
const TOOLTIP_FULLSCREEN_THRESHOLD = 480;
export const TOOLTIP_MAX_WIDTH = 320;

export function formatValueForTooltip(
    val: string | number,
    format: string,
    separators?: ISeparators,
): string {
    const formattedObject: INumberObject = colors2Object(numberFormat(val, format, undefined, separators));
    return customEscape(formattedObject.label);
}

export function getFormattedValueForTooltip(
    isDualChartWithRightAxis: boolean,
    stackMeasuresToPercent: boolean,
    point: IPointData,
    separators?: ISeparators,
    percentageValue?: number,
): string {
    const { target, y, format } = point;
    const isNotStackToPercent =
        stackMeasuresToPercent === false || isNil(percentageValue) || isDualChartWithRightAxis;

    return isNotStackToPercent
        ? formatValueForTooltip(target ? target : y, format, separators)
        : percentFormatter(percentageValue);
}

export const isTooltipShownInFullScreen = () => {
    return document.documentElement.clientWidth <= TOOLTIP_FULLSCREEN_THRESHOLD;
};

export const getTooltipContentWidth = (
    isFullScreenTooltip: boolean,
    chartWidth: number,
    tooltipMaxWidth: number,
): number => {
    return isFullScreenTooltip ? chartWidth : Math.min(chartWidth, tooltipMaxWidth);
};
