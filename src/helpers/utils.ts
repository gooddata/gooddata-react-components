// (C) 2007-2020 GoodData Corporation
import isObject = require("lodash/isObject");
import isFinite = require("lodash/isFinite");
import get = require("lodash/get");
import set = require("lodash/set");
import isNil = require("lodash/isNil");
import { VisualizationObject } from "@gooddata/typings";
import { SDK } from "@gooddata/gooddata-js";

import { name as pkgName, version as pkgVersion } from "../../package.json";
import { IMinMax } from "../interfaces/Utils";
import { IPositioning } from "../typings/positioning";
import { FLUID_LEGEND_THRESHOLD } from "../constants/legend";

export function setTelemetryHeaders(sdk: SDK, componentName: string, props: object) {
    sdk.config.setJsPackage(pkgName, pkgVersion);

    sdk.config.setRequestHeader("X-GDC-JS-SDK-COMP", componentName);
    if (isObject(props)) {
        sdk.config.setRequestHeader("X-GDC-JS-SDK-COMP-PROPS", Object.keys(props).join(","));
    }
}

export function getObjectIdFromUri(uri: string): string {
    const match = /\/obj\/([^$\/\?]*)/.exec(uri);
    return match ? match[1] : null;
}

export function visualizationIsBetaWarning() {
    // tslint:disable-next-line no-console
    console.warn(
        "This chart is not production-ready and may not provide the full functionality. Use it at your own risk.",
    );
}

export function percentFormatter(value: number): string {
    return isNil(value) ? "" : `${parseFloat(value.toFixed(2))}%`;
}

export const unwrap = (wrappedObject: any) => {
    return wrappedObject[Object.keys(wrappedObject)[0]];
};

export function stringToFloat(text: string): number {
    const parsedNumber = parseFloat(text);
    if (isNaN(parsedNumber)) {
        // tslint:disable-next-line no-console
        console.warn(`SDK: utils - stringToFloat: ${text} is not a number`);
    }
    return parsedNumber;
}

/**
 * Get min/max values in number array and ignore NaN values
 * @param data
 */
export function getMinMax(data: number[]): IMinMax {
    return data.reduce((result: IMinMax, value: number): IMinMax => {
        if (!isFinite(value)) {
            return result;
        }
        const min = isFinite(result.min) ? Math.min(value, result.min) : value;
        const max = isFinite(result.max) ? Math.max(value, result.max) : value;
        return {
            min,
            max,
        };
    }, {});
}

export function disableBucketItemComputeRatio<T extends VisualizationObject.BucketItem>(item: T): T {
    if (getComputeRatio(item)) {
        setComputeRatio(item, false);
    }
    return item;
}

export function getComputeRatio(bucketItem: VisualizationObject.BucketItem): boolean {
    return get(bucketItem, ["measure", "definition", "measureDefinition", "computeRatio"], false);
}

function setComputeRatio(bucketItem: VisualizationObject.BucketItem, value: boolean) {
    set(bucketItem, ["measure", "definition", "measureDefinition", "computeRatio"], value);
}

export function shouldShowFluid(documentObj: Document) {
    if (!documentObj) {
        return false;
    }

    return documentObj.documentElement.clientWidth < FLUID_LEGEND_THRESHOLD;
}

export const sleep = async (delay: number): Promise<void> => {
    return new Promise(resolve => {
        // tslint:disable-next-line no-string-based-set-timeout
        setTimeout(resolve, delay);
    });
};

export const positioningToAlignPoints = (positioning: IPositioning[]) =>
    positioning.map(({ snapPoints, offset }) => ({
        align: `${snapPoints.parent} ${snapPoints.child}`,
        offset,
    }));
