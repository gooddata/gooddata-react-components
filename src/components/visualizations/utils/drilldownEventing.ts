// (C) 2007-2019 GoodData Corporation
import get = require("lodash/get");
import debounce = require("lodash/debounce");
import * as CustomEvent from "custom-event";
import * as invariant from "invariant";
import Highcharts from "../chart/highcharts/highchartsEntryPoint";
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
    IDrillPoint,
    IHighchartsPointObject,
    IDrillConfig,
    ICellDrillEvent,
    isGroupHighchartsDrillEvent,
    IDrillEventContext,
    IDrillEventIntersectionElementExtended,
    IDrillEventContextExtended,
    IDrillEventExtended,
    IDrillPointExtended,
    isMappingMeasureHeaderItem,
    IDrillEventContextGroupExtended,
    isDrillIntersectionAttributeItem,
    IDrillPointBase,
    IDrillEventContextPointExtended,
    IDrillEventContextPointBase,
    IDrillEventContextBase,
    DrillEventIntersectionElementHeader,
} from "../../../interfaces/DrillEvents";
import { OnFiredDrillEvent } from "../../../interfaces/Events";
import { isComboChart, isHeatmap, isTreemap, getAttributeElementIdFromAttributeElementUri } from "./common";
import { getVisualizationType } from "../../../helpers/visualizationType";
import { getMasterMeasureObjQualifier } from "../../../helpers/afmHelper";
import { AFM, Execution } from "@gooddata/typings";
import {
    IMappingHeader,
    isMappingHeaderAttribute,
    isMappingHeaderAttributeItem,
    isMappingHeaderMeasureItem,
} from "../../../interfaces/MappingHeader";

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

function fireEvent(onFiredDrillEvent: OnFiredDrillEvent, data: any, target: EventTarget) {
    const returnValue = onFiredDrillEvent(data);

    // if user-specified onFiredDrillEvent fn returns false, do not fire default DOM event
    if (returnValue !== false) {
        const event = new CustomEvent("drill", {
            detail: data,
            bubbles: true,
        });
        target.dispatchEvent(event);
    }
}

const getDrillPoint = (chartType: ChartType) => (point: IHighchartsPointObject): IDrillPointExtended => {
    const customProps: Partial<IDrillPointBase> = isComboChart(chartType)
        ? { type: get(point, "series.type") }
        : {};

    const result: IDrillPointExtended = {
        x: point.x,
        y: point.y,
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
    const xyProp = isTreemap(chartType)
        ? {}
        : {
              x: point.x,
              y: point.y,
          };

    const elementChartType: ChartType = get(point, "series.type", chartType);
    const customProp: Partial<IDrillEventContextPointBase> = isComboChart(chartType)
        ? {
              elementChartType,
          }
        : {};

    return {
        type: chartType,
        element: getClickableElementNameByChartType(elementChartType),
        intersection: point.drillIntersection,
        ...xyProp,
        ...zProp,
        ...valueProp,
        ...customProp,
    };
}

const convertIntersectionToLegacy = (
    intersection: IDrillEventIntersectionElementExtended[],
    afm: AFM.IAfm,
): IDrillEventIntersectionElement[] => {
    return intersection.map((intersectionItem: IDrillEventIntersectionElementExtended) => {
        const { header } = intersectionItem;
        if (isDrillIntersectionAttributeItem(header)) {
            const { uri: itemUri, name } = header.attributeHeaderItem;
            const { uri, identifier } = header.attributeHeader;
            return createDrillIntersectionElement(
                getAttributeElementIdFromAttributeElementUri(itemUri),
                name,
                uri,
                identifier,
            );
        }
        return convertMeasureHeaderItem(header, afm);
    });
};

const convertPointToLegacy = (afm: AFM.IAfm) => (point: IDrillPointExtended): IDrillPoint => {
    return {
        ...point,
        intersection: convertIntersectionToLegacy(point.intersection, afm),
    };
};

const convertDrillContextToLegacy = (
    drillContext: IDrillEventContextExtended,
    afm: AFM.IAfm,
): IDrillEventContext => {
    const isGroup = !!drillContext.points;
    const convertedProp = isGroup
        ? {
              points: drillContext.points.map(convertPointToLegacy(afm)),
          }
        : {
              intersection: convertIntersectionToLegacy(drillContext.intersection, afm),
          };
    return {
        ...(drillContext as IDrillEventContextBase),
        ...convertedProp,
    };
};

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

        fireEvent(onFiredDrillEvent, drillEventLegacy, target);
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
    const contextPoints: IDrillPointExtended[] = points.map((point: IHighchartsPointObject) => ({
        x: point.x,
        y: point.y,
        intersection: point.drillIntersection,
    }));

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

        fireEvent(onFiredDrillEvent, data, target);
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

    fireEvent(onFiredDrillEvent, data, target);
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

const convertMeasureHeaderItem = (
    header: DrillEventIntersectionElementHeader,
    afm: AFM.IAfm,
): IDrillEventIntersectionElement => {
    if (!isMappingMeasureHeaderItem(header)) {
        throw new Error("Converting wrong item type, IMeasureHeaderItem expected!");
    }

    const { localIdentifier, name, uri: headerUri, identifier: headerIdentifier } = header.measureHeaderItem;

    const masterMeasureQualifier = getMasterMeasureObjQualifier(afm, localIdentifier);

    if (!masterMeasureQualifier) {
        throw new Error("The metric ids has not been found in execution request!");
    }

    const id: string = localIdentifier;
    const uri = masterMeasureQualifier.uri || headerUri;
    const identifier = masterMeasureQualifier.identifier || headerIdentifier;
    return createDrillIntersectionElement(id, name, uri, identifier);
};

export function convertHeadlineDrillIntersectionToLegacy(
    intersectionExtended: IDrillEventIntersectionElementExtended[],
    afm: AFM.IAfm,
): IDrillEventIntersectionElement[] {
    return intersectionExtended
        .filter(({ header }) => isMappingMeasureHeaderItem(header))
        .map(intersectionElement => {
            const header = intersectionElement.header as Execution.IMeasureHeaderItem;
            const { localIdentifier, name } = header.measureHeaderItem;

            const masterMeasureQualifier = getMasterMeasureObjQualifier(afm, localIdentifier);

            if (!masterMeasureQualifier) {
                throw new Error("The metric ids has not been found in execution request!");
            }

            return createDrillIntersectionElement(
                localIdentifier,
                name,
                masterMeasureQualifier.uri,
                masterMeasureQualifier.identifier,
            );
        });
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
