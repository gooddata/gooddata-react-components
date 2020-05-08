// (C) 2007-2020 GoodData Corporation

import { AFM, Execution } from "@gooddata/typings";
import { getMasterMeasureObjQualifier } from "../../../helpers/afmHelper";
import {
    getMappingHeaderIdentifier,
    getMappingHeaderLocalIdentifier,
    getMappingHeaderName,
    getMappingHeaderUri,
} from "../../../helpers/mappingHeader";
import get = require("lodash/get");
import {
    IDrillEventIntersectionElement,
    IDrillEventIntersectionElementExtended,
    isDrillIntersectionAttributeItem,
    isMappingMeasureHeaderItem,
    IDrillEventContextTable,
    IDrillEventContextTableExtended,
} from "../../../interfaces/DrillEvents";
import { IMappingHeader, isMappingHeaderAttributeItem } from "../../../interfaces/MappingHeader";
import { getAttributeElementIdFromAttributeElementUri } from "../../visualizations/utils/common";
import { createDrillIntersectionElement } from "../../visualizations/utils/drilldownEventing";
import { getIdsFromUri } from "./agGridUtils";
import { COLUMN_ATTRIBUTE_COLUMN, MEASURE_COLUMN, ROW_ATTRIBUTE_COLUMN } from "./agGridConst";
import { ColDef } from "ag-grid-community";
import { IGridHeader } from "./agGridTypes";

export const getDrillRowData = (leafColumnDefs: ColDef[], rowData: { [key: string]: any }) => {
    return leafColumnDefs.reduce((drillRow, colDef: ColDef) => {
        const { type } = colDef;
        // colDef without field is a utility column (e.g. top column label)
        if (colDef.field) {
            if (type === MEASURE_COLUMN) {
                return [...drillRow, rowData[colDef.field]];
            }
            const drillItem = get(rowData, ["headerItemMap", colDef.field]);
            if (drillItem && (type === COLUMN_ATTRIBUTE_COLUMN || type === ROW_ATTRIBUTE_COLUMN)) {
                const drillItemUri = getMappingHeaderUri(drillItem);
                return [
                    ...drillRow,
                    {
                        // Unlike fields, drilling data should not be sanitized, because it is not used in HTML properties
                        id: getIdsFromUri(drillItemUri, false)[1],
                        name: rowData[colDef.field],
                    },
                ];
            }
        }
        return drillRow;
    }, []);
};

const isDrillingOnMeasure = (measureIndex: number) => measureIndex !== -1;

const skipRowAttributes = (measureIndex: number) => (index: number) =>
    isDrillingOnMeasure(measureIndex) && index > measureIndex;

const getMeasurePositionInsideIntersection = (
    intersection: IDrillEventIntersectionElementExtended[],
): number =>
    intersection.findIndex((intersectionElement: IDrillEventIntersectionElementExtended) =>
        isMappingMeasureHeaderItem(intersectionElement.header),
    );

export const convertPivotTableDrillContextToLegacy = (
    drillContext: IDrillEventContextTableExtended,
    executionContext: AFM.IAfm,
): IDrillEventContextTable => {
    return {
        ...drillContext,
        intersection: convertDrillIntersectionToLegacy(drillContext.intersection, executionContext),
    };
};

export const convertDrillIntersectionToLegacy = (
    intersectionExtended: IDrillEventIntersectionElementExtended[],
    afm: AFM.IAfm,
): IDrillEventIntersectionElement[] => {
    // structure for new intersection when drilling on measure cell
    // [0..n] column attribute+item header
    // [1] measure header
    // [0..n] row attribute+item header - these needs to be removed during conversion to be backward compatible
    const measureIndex = getMeasurePositionInsideIntersection(intersectionExtended);
    const drillingOnMeasure = isDrillingOnMeasure(measureIndex);
    const shouldSkipRowAttributes = skipRowAttributes(measureIndex);
    const drillItems: IMappingHeader[] = intersectionExtended.reduce(
        (
            drillItems: IMappingHeader[],
            intersectionElement: IDrillEventIntersectionElementExtended,
            index: number,
        ) => {
            if (shouldSkipRowAttributes(index)) {
                // skip new row attributes in legacy intersection
                return drillItems;
            }
            if (isDrillIntersectionAttributeItem(intersectionElement.header)) {
                const { attributeHeader, attributeHeaderItem } = intersectionElement.header;
                if (drillingOnMeasure) {
                    // different item/attribute order for drilling on measure and drilling on attr :(
                    drillItems.push({ attributeHeaderItem });
                    drillItems.push({ attributeHeader });
                } else {
                    drillItems.push({ attributeHeader });
                    drillItems.push({ attributeHeaderItem });
                }
            } else {
                drillItems.push(intersectionElement.header);
            }
            return drillItems;
        },
        [],
    );
    // Drilling needs refactoring: all '' should be replaced by null (breaking change)
    // intersection consists of
    //     0..1 measure
    //     0..1 row attribute and row attribute value
    //     0..n column attribute and column attribute values
    return drillItems.map((drillItem: IMappingHeader) => {
        if (isMappingHeaderAttributeItem(drillItem)) {
            const id = getAttributeElementIdFromAttributeElementUri(drillItem.attributeHeaderItem.uri);
            return createDrillIntersectionElement(
                id,
                getMappingHeaderName(drillItem),
                getMappingHeaderUri(drillItem),
                "",
            );
        }

        const headerLocalIdentifier = getMappingHeaderLocalIdentifier(drillItem);
        const headerIdentifier = getMappingHeaderIdentifier(drillItem) || "";
        const uriAndIdentifier = headerLocalIdentifier
            ? getMasterMeasureObjQualifier(afm, headerLocalIdentifier)
            : null;

        const headerUri = getMappingHeaderUri(drillItem) || "";
        const uri = (uriAndIdentifier && uriAndIdentifier.uri) || headerUri;
        const identifier = (uriAndIdentifier && uriAndIdentifier.identifier) || headerIdentifier;
        const id = headerLocalIdentifier || headerIdentifier;

        return createDrillIntersectionElement(id, getMappingHeaderName(drillItem), uri, identifier);
    });
};

export const getMeasureDrillItem = (
    responseHeaders: Execution.IHeader[],
    header: Execution.IResultMeasureHeaderItem,
) => {
    const measureGroupHeader = responseHeaders.find(responseHeader =>
        Execution.isMeasureGroupHeader(responseHeader),
    ) as Execution.IMeasureGroupHeader;

    return get(measureGroupHeader, ["measureGroupHeader", "items", header.measureHeaderItem.order], null);
};

export const assignDrillItemsAndType = (
    header: IGridHeader,
    currentHeader: Execution.IResultHeaderItem,
    responseHeaders: Execution.IHeader[],
    headerIndex: number,
    drillItems: IMappingHeader[],
) => {
    if (Execution.isAttributeHeaderItem(currentHeader)) {
        header.type = COLUMN_ATTRIBUTE_COLUMN;
        // attribute value uri
        drillItems.push(currentHeader);
        // attribute uri and identifier
        const attributeResponseHeader = responseHeaders[
            headerIndex % responseHeaders.length
        ] as Execution.IAttributeHeader;
        drillItems.push(attributeResponseHeader);
        // This is where we could assign drillItems if we want to start drilling on column headers
        // It needs to have an empty array for some edge cases like column attributes without measures
    } else if (Execution.isMeasureHeaderItem(currentHeader)) {
        // measure uri and identifier
        header.type = MEASURE_COLUMN;
        drillItems.push(getMeasureDrillItem(responseHeaders, currentHeader));
        header.drillItems = drillItems;
        header.measureIndex = currentHeader.measureHeaderItem.order;
    }
};
