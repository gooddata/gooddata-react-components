// (C) 2007-2020 GoodData Corporation
import get = require("lodash/get");
import debounce = require("lodash/debounce");
import omit = require("lodash/omit");
import without = require("lodash/without");
import * as CustomEvent from "custom-event";
import * as invariant from "invariant";
import Highcharts from "../chart/highcharts/highchartsEntryPoint";
import { IUnwrappedAttributeHeaderWithItems } from "../../visualizations/typings/chart";
import {
    ChartElementType,
    ChartType,
    VisType,
    VisualizationTypes,
} from "../../../constants/visualizationTypes";
import {
    IDrillEvent,
    IDrillEventIntersectionElement,
    IDrillEventContextTable,
    IHighchartsPointObject,
    IDrillConfig,
    ICellDrillEvent,
    isGroupHighchartsDrillEvent,
    IDrillEventContext,
    IDrillEventIntersectionElementExtended,
    IDrillEventContextExtended,
    IDrillEventExtended,
    IDrillPointExtended,
    IDrillEventContextGroupExtended,
    IDrillPointBase,
    IDrillEventContextPointExtended,
    IDrillEventContextPointBase,
    IGeoDrillEvent,
} from "../../../interfaces/DrillEvents";
import { OnFiredDrillEvent } from "../../../interfaces/Events";
import { IGeoData } from "../../../interfaces/GeoChart";
import { IHeaderPredicate } from "../../../interfaces/HeaderPredicate";
import { isComboChart, isHeatmap, isTreemap, isBulletChart } from "./common";
import { findMeasureGroupInDimensions } from "../../../helpers/executionResultHelper";
import { findGeoAttributesInDimension } from "../../../helpers/geoChart/executionResultHelper";
import { parseGeoProperties } from "../../../helpers/geoChart/data";

import { isSomeHeaderPredicateMatched } from "../../../helpers/headerPredicate";
import { getVisualizationType } from "../../../helpers/visualizationType";
import { AFM, Execution } from "@gooddata/typings";
import {
    IMappingHeader,
    isMappingHeaderAttribute,
    isMappingHeaderAttributeItem,
    isMappingHeaderMeasureItem,
} from "../../../interfaces/MappingHeader";
import { convertDrillContextToLegacy } from "./drilldownEventingLegacy";

export function getClickableElementNameByChartType(type: VisType): ChartElementType {
    switch (type) {
        case VisualizationTypes.LINE:
        case VisualizationTypes.AREA:
        case VisualizationTypes.SCATTER:
        case VisualizationTypes.BUBBLE:
            return "point";
        case VisualizationTypes.COLUMN:
        case VisualizationTypes.BAR:
            return "bar";
        case VisualizationTypes.PIE:
        case VisualizationTypes.TREEMAP:
        case VisualizationTypes.DONUT:
        case VisualizationTypes.FUNNEL:
            return "slice";
        case VisualizationTypes.HEATMAP:
            return "cell";
        default:
            invariant(false, `Unknown visualization type: ${type}`);
            return null;
    }
}

export function fireDrillEvent(onFiredDrillEvent: OnFiredDrillEvent, data: any, target: EventTarget) {
    const returnValue = onFiredDrillEvent && onFiredDrillEvent(data);

    // if user-specified onFiredDrillEvent fn returns false, do not fire default DOM event
    if (returnValue !== false) {
        const event = new CustomEvent("drill", {
            detail: data,
            bubbles: true,
        });
        target.dispatchEvent(event);
    }
}

const getElementChartType = (chartType: ChartType, point: IHighchartsPointObject): ChartType => {
    return get(point, "series.type", chartType);
};

const getDrillPointCustomProps = (
    point: IHighchartsPointObject,
    chartType: ChartType,
): Partial<IDrillPointBase> => {
    if (isComboChart(chartType)) {
        return { type: get(point, "series.type") };
    }

    if (isBulletChart(chartType)) {
        return { type: get(point, "series.userOptions.bulletChartMeasureType") };
    }

    return {};
};

const getYValueForBulletChartTarget = (point: IHighchartsPointObject): number => {
    if (point.isNullTarget) {
        return null;
    }
    return point.target;
};

const getDrillPoint = (chartType: ChartType) => (point: IHighchartsPointObject): IDrillPointExtended => {
    const customProps = getDrillPointCustomProps(point, chartType);

    const elementChartType = getElementChartType(chartType, point);
    const result: IDrillPointExtended = {
        x: point.x,
        y: elementChartType === "bullet" ? getYValueForBulletChartTarget(point) : point.y,
        intersection: point.drillIntersection,
        ...customProps,
    };
    return result;
};

function composeDrillContextGroup(
    points: IHighchartsPointObject[],
    chartType: ChartType,
): IDrillEventContextGroupExtended {
    const sanitizedPoints = sanitizeContextPoints(chartType, points);
    const contextPoints: IDrillPointExtended[] = sanitizedPoints.map(getDrillPoint(chartType));

    return {
        type: chartType,
        element: "label",
        points: contextPoints,
    };
}

function getClickableElementNameForBulletChart(point: any) {
    return point.series.userOptions.bulletChartMeasureType;
}

function composeDrillContextPoint(
    point: IHighchartsPointObject,
    chartType: ChartType,
): IDrillEventContextPointExtended {
    const zProp = isNaN(point.z) ? {} : { z: point.z };
    const valueProp =
        isTreemap(chartType) || isHeatmap(chartType)
            ? {
                  value: point.value ? point.value.toString() : "",
              }
            : {};
    const elementChartType = getElementChartType(chartType, point);
    const xyProp = isTreemap(chartType)
        ? {}
        : {
              x: point.x,
              y: elementChartType === "bullet" ? point.target : point.y,
          };

    const customProp: Partial<IDrillEventContextPointBase> = isComboChart(chartType)
        ? {
              elementChartType,
          }
        : {};

    return {
        type: chartType,
        element: isBulletChart(chartType)
            ? getClickableElementNameForBulletChart(point)
            : getClickableElementNameByChartType(elementChartType),
        intersection: point.drillIntersection,
        ...xyProp,
        ...zProp,
        ...valueProp,
        ...customProp,
    };
}

const chartClickDebounced = debounce(
    (
        drillConfig: IDrillConfig,
        event: Highcharts.DrilldownEventObject,
        target: EventTarget,
        chartType: ChartType,
    ) => {
        const { afm, onFiredDrillEvent, onDrill } = drillConfig;
        const type = getVisualizationType(chartType);
        let drillContext: IDrillEventContextExtended = null;
        if (isGroupHighchartsDrillEvent(event)) {
            const points = event.points as IHighchartsPointObject[];
            drillContext = composeDrillContextGroup(points, type);
        } else {
            const point: IHighchartsPointObject = event.point as IHighchartsPointObject;
            drillContext = composeDrillContextPoint(point, type);
        }

        const drillEventExtended: IDrillEventExtended = {
            executionContext: afm,
            drillContext,
        };

        if (onDrill) {
            onDrill(drillEventExtended);
        }

        const drillContextLegacy: IDrillEventContext = convertDrillContextToLegacy(drillContext, afm);
        const drillEventLegacy: IDrillEvent = {
            executionContext: afm,
            drillContext: drillContextLegacy,
        };

        fireDrillEvent(onFiredDrillEvent, drillEventLegacy, target);
    },
);

export function chartClick(
    drillConfig: IDrillConfig,
    event: Highcharts.DrilldownEventObject,
    target: EventTarget,
    chartType: ChartType,
) {
    chartClickDebounced(drillConfig, event, target, chartType);
}

const getDrillEvent = (
    points: IHighchartsPointObject[],
    chartType: ChartType,
    afm: AFM.IAfm,
): IDrillEventExtended => {
    const contextPoints: IDrillPointExtended[] = points.map((point: IHighchartsPointObject) => {
        const customProps = isBulletChart(chartType)
            ? { type: get(point, "series.userOptions.bulletChartMeasureType") }
            : {};
        return {
            x: point.x,
            y: point.y,
            intersection: point.drillIntersection,
            ...customProps,
        };
    });

    const drillContext: IDrillEventContextExtended = {
        type: chartType,
        element: "label",
        points: contextPoints,
    };

    return {
        executionContext: afm,
        drillContext,
    };
};

const tickLabelClickDebounce = debounce(
    (
        drillConfig: IDrillConfig,
        points: IHighchartsPointObject[],
        target: EventTarget,
        chartType: ChartType,
    ): void => {
        const { afm, onFiredDrillEvent, onDrill } = drillConfig;
        const sanitizedPoints = sanitizeContextPoints(chartType, points);

        const dataExtended: IDrillEventExtended = getDrillEvent(sanitizedPoints, chartType, afm);

        if (onDrill) {
            onDrill(dataExtended);
        }

        const drillContext: IDrillEventContext = convertDrillContextToLegacy(dataExtended.drillContext, afm);

        const data: IDrillEvent = {
            executionContext: afm,
            drillContext,
        };

        fireDrillEvent(onFiredDrillEvent, data, target);
    },
);

function sanitizeContextPoints(
    chartType: ChartType,
    points: IHighchartsPointObject[],
): IHighchartsPointObject[] {
    if (isHeatmap(chartType)) {
        return points.filter((point: IHighchartsPointObject) => !point.ignoredInDrillEventContext);
    }
    return points;
}

export function tickLabelClick(
    drillConfig: IDrillConfig,
    points: IHighchartsPointObject[],
    target: EventTarget,
    chartType: ChartType,
) {
    tickLabelClickDebounce(drillConfig, points, target, chartType);
}

export function cellClick(drillConfig: IDrillConfig, event: ICellDrillEvent, target: EventTarget) {
    const { afm, onFiredDrillEvent } = drillConfig;
    const { columnIndex, rowIndex, row, intersection } = event;

    const drillContext: IDrillEventContextTable = {
        type: VisualizationTypes.TABLE,
        element: "cell",
        columnIndex,
        rowIndex,
        row,
        intersection,
    };
    const data: IDrillEvent = {
        executionContext: afm,
        drillContext,
    };

    fireDrillEvent(onFiredDrillEvent, data, target);
}

export function createDrillIntersectionElement(
    id: string,
    title: string,
    uri?: string,
    identifier?: string,
): IDrillEventIntersectionElement {
    const element: IDrillEventIntersectionElement = {
        id: id || "",
        title: title || "",
    };

    if (uri || identifier) {
        element.header = {
            uri: uri || "",
            identifier: identifier || "",
        };
    }

    return element;
}

// shared by charts and table
export const getDrillIntersection = (
    drillItems: IMappingHeader[],
): IDrillEventIntersectionElementExtended[] => {
    return drillItems.reduce(
        (
            drillIntersection: IDrillEventIntersectionElementExtended[],
            drillItem: IMappingHeader,
            index: number,
            drillItems: IMappingHeader[],
        ): IDrillEventIntersectionElementExtended[] => {
            if (isMappingHeaderAttribute(drillItem)) {
                const attributeItem = drillItems[index - 1]; // attribute item is always before attribute
                if (attributeItem && isMappingHeaderAttributeItem(attributeItem)) {
                    drillIntersection.push({
                        header: {
                            ...attributeItem,
                            ...drillItem,
                        },
                    });
                } else {
                    // no attr. item before attribute -> use only attribute header
                    drillIntersection.push({
                        header: drillItem,
                    });
                }
            } else if (isMappingHeaderMeasureItem(drillItem)) {
                drillIntersection.push({
                    header: drillItem,
                });
            }
            return drillIntersection;
        },
        [],
    );
};

function getDrillIntersectionForGeoChart(
    drillableItems: IHeaderPredicate[],
    drillConfig: IDrillConfig,
    execution: Execution.IExecutionResponses,
    geoData: IGeoData,
    locationIndex: number,
): IDrillEventIntersectionElementExtended[] {
    const { executionResponse } = execution;
    const { dimensions } = executionResponse;

    const { items: measureGroupItems = [] } = findMeasureGroupInDimensions(dimensions) || {};
    const measureHeaders: Execution.IMeasureHeaderItem[] = measureGroupItems.slice(0, 2);

    const { locationAttribute, segmentByAttribute, tooltipTextAttribute } = findGeoAttributesInDimension(
        execution,
        geoData,
    );
    const {
        attributeHeader: locationAttributeHeader,
        attributeHeaderItem: locationAttributeHeaderItem,
    } = getAttributeHeader(locationAttribute, locationIndex);
    const {
        attributeHeader: segmentByAttributeHeader,
        attributeHeaderItem: segmentByAttributeHeaderItem,
    } = getAttributeHeader(segmentByAttribute, locationIndex);
    const {
        attributeHeader: tooltipTextAttributeHeader,
        attributeHeaderItem: tooltipTextAttributeHeaderItem,
    } = getAttributeHeader(tooltipTextAttribute, locationIndex);

    // pin is drillable if a drillableItem matches:
    //   pin's measure,
    //   pin's location attribute,
    //   pin's location attribute item,
    //   pin's segmentBy attribute,
    //   pin's segmentBy attribute item,
    //   pin's tooltipText attribute,
    //   pin's tooltipText attribute item,
    const drillItems: IMappingHeader[] = without(
        [
            ...measureHeaders,
            locationAttributeHeaderItem,
            locationAttributeHeader,
            segmentByAttributeHeaderItem,
            segmentByAttributeHeader,
            tooltipTextAttributeHeaderItem,
            tooltipTextAttributeHeader,
        ],
        undefined,
    );

    const drilldown: boolean = drillItems.some(
        (drillableHook: IMappingHeader): boolean =>
            isSomeHeaderPredicateMatched(drillableItems, drillableHook, drillConfig.afm, executionResponse),
    );

    if (drilldown) {
        return getDrillIntersection(drillItems);
    }

    return undefined;
}

function getAttributeHeader(
    attribute: IUnwrappedAttributeHeaderWithItems,
    dataIndex: number,
): {
    attributeHeader: Execution.IAttributeHeader;
    attributeHeaderItem: Execution.IResultAttributeHeaderItem;
} {
    if (attribute) {
        return {
            attributeHeader: { attributeHeader: omit(attribute, "items") },
            attributeHeaderItem: attribute.items[dataIndex],
        };
    }
    return {
        attributeHeader: undefined,
        attributeHeaderItem: undefined,
    };
}

export function handleGeoPushpinDrillEvent(
    drillableItems: IHeaderPredicate[],
    drillConfig: IDrillConfig,
    execution: Execution.IExecutionResponses,
    geoData: IGeoData,
    pinProperties: GeoJSON.GeoJsonProperties,
    pinCoordinates: number[],
    target: EventTarget,
): void {
    const { locationIndex } = pinProperties;
    const drillIntersection: IDrillEventIntersectionElementExtended[] = getDrillIntersectionForGeoChart(
        drillableItems,
        drillConfig,
        execution,
        geoData,
        locationIndex,
    );

    if (!drillIntersection || !drillIntersection.length) {
        return;
    }

    const { afm, onDrill, onFiredDrillEvent } = drillConfig;
    const [lng, lat] = pinCoordinates;
    const {
        locationName: { value: locationNameValue },
        color: { value: colorValue },
        segment: { value: segmentByValue },
        size: { value: sizeValue },
    } = parseGeoProperties(pinProperties);
    const drillContext: IGeoDrillEvent = {
        element: "pushpin",
        intersection: drillIntersection,
        type: "pushpin",
        color: colorValue,
        location: { lat, lng },
        locationName: locationNameValue,
        segmentBy: segmentByValue,
        size: sizeValue,
    };
    const drillEventExtended: IDrillEventExtended = {
        executionContext: afm,
        drillContext,
    };

    if (onDrill) {
        onDrill(drillEventExtended);
    }

    const drillContextLegacy: IDrillEventContext = convertDrillContextToLegacy(drillContext, afm);
    const drillEventLegacy: IDrillEvent = {
        executionContext: afm,
        drillContext: drillContextLegacy,
    };

    fireDrillEvent(onFiredDrillEvent, drillEventLegacy, target);
}
