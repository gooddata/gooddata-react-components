// (C) 2020 GoodData Corporation
import {
    IDrillEventContext,
    IDrillEventContextExtended,
    isDrillEventContextTableExtended,
    isDrillEventContextHeadlineExtended,
    IDrillEventIntersectionElement,
    isMappingMeasureHeaderItem,
    IDrillEventIntersectionElementExtended,
    IDrillEventContextBase,
    isDrillIntersectionAttributeItem,
    DrillEventIntersectionElementHeader,
    IDrillPointExtended,
    IDrillPoint,
    isDrillEventContextXirrExtended,
} from "../../../interfaces/DrillEvents";

import { AFM, Execution } from "@gooddata/typings";

import { convertPivotTableDrillContextToLegacy } from "../../core/pivotTable/agGridDrilling";
import { getMasterMeasureObjQualifier } from "../../../helpers/afmHelper";
import { createDrillIntersectionElement } from "./drilldownEventing";
import { getAttributeElementIdFromAttributeElementUri } from "./common";

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

const convertChartsDrillContextToLegacy = (
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

function convertHeadlineDrillIntersectionToLegacy(
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

function convertHeadlineDrillContextToLegacy(
    drillContext: IDrillEventContextExtended,
    executionContext: AFM.IAfm,
): IDrillEventContext {
    const { type, element, value } = drillContext;
    return {
        type,
        element,
        value,
        intersection: convertHeadlineDrillIntersectionToLegacy(drillContext.intersection, executionContext),
    };
}

export const convertDrillContextToLegacy = (
    drillContext: IDrillEventContextExtended,
    executionContext: AFM.IAfm,
): IDrillEventContext => {
    if (isDrillEventContextTableExtended(drillContext)) {
        return convertPivotTableDrillContextToLegacy(drillContext, executionContext);
    }
    if (isDrillEventContextHeadlineExtended(drillContext) || isDrillEventContextXirrExtended(drillContext)) {
        return convertHeadlineDrillContextToLegacy(drillContext, executionContext);
    }
    return convertChartsDrillContextToLegacy(drillContext, executionContext);
};
