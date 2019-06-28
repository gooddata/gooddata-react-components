// (C) 2019 GoodData Corporation
import { AFM, Execution } from "@gooddata/typings";
import invariant from "invariant";
import uniq from "lodash/uniq";
import intersection from "lodash/intersection";
import isEqual from "lodash/isEqual";
import sortBy from "lodash/sortBy";

import { FIELD_TYPE_ATTRIBUTE, FIELD_TYPE_MEASURE } from "./agGridConst";
import { AVAILABLE_TOTALS } from "../../visualizations/table/totals/utils";
import { IColumnTotal } from "./AggregationsMenu";
import { IMenuAggregationClickConfig } from "../../../interfaces/PivotTable";

function getTotalsForMeasureAndType(
    totals: AFM.ITotalItem[],
    type: AFM.TotalType,
    measureLocalIdentifier: string,
) {
    return totals.filter(total => total.measureIdentifier === measureLocalIdentifier && total.type === type);
}

function getAttributeIntersection(
    totals: AFM.ITotalItem[],
    type: AFM.TotalType,
    measureLocalIdentifiers: string[],
) {
    const attributeGroups: string[][] = measureLocalIdentifiers.map((measure: string) => {
        const filteredTotals = getTotalsForMeasureAndType(totals, type, measure);
        return filteredTotals.map(total => total.attributeIdentifier);
    });
    return intersection.apply(null, attributeGroups);
}

function getUniqueMeasures(totals: AFM.ITotalItem[], type: AFM.TotalType) {
    const totalsOfType = totals.filter(total => total.type === type);
    return uniq(totalsOfType.map(total => total.measureIdentifier));
}

function areMeasuresSame(measureLocalIdentifiers1: string[], measureLocalIdentifiers2: string[]) {
    const sameMeasureLocalIdentifiers: string[] = intersection(
        measureLocalIdentifiers1,
        measureLocalIdentifiers2,
    );
    return sameMeasureLocalIdentifiers.length === measureLocalIdentifiers2.length;
}

function getTotalsForAttributeHeader(
    totals: AFM.ITotalItem[],
    measureLocalIdentifiers: string[],
): IColumnTotal[] {
    return AVAILABLE_TOTALS.reduce((columnTotals: IColumnTotal[], type: AFM.TotalType) => {
        const uniqueMeasureLocalIdentifiers = getUniqueMeasures(totals, type);
        if (areMeasuresSame(uniqueMeasureLocalIdentifiers, measureLocalIdentifiers)) {
            const attributeLocalIdentifiers = getAttributeIntersection(
                totals,
                type,
                uniqueMeasureLocalIdentifiers,
            );
            if (attributeLocalIdentifiers.length) {
                columnTotals.push({
                    type,
                    attributes: attributeLocalIdentifiers,
                });
            }
        }
        return columnTotals;
    }, []);
}

function getTotalsForMeasureHeader(totals: AFM.ITotalItem[], measureLocalIdentifier: string): IColumnTotal[] {
    return totals.reduce((turnedOnAttributes: IColumnTotal[], total: AFM.ITotalItem) => {
        if (total.measureIdentifier === measureLocalIdentifier) {
            const totalHeaderType = turnedOnAttributes.find(turned => turned.type === total.type);
            if (totalHeaderType === undefined) {
                turnedOnAttributes.push({
                    type: total.type,
                    attributes: [total.attributeIdentifier],
                });
            } else {
                totalHeaderType.attributes.push(total.attributeIdentifier);
            }
        }
        return turnedOnAttributes;
    }, []);
}

function getHeaderMeasureLocalIdentifiers(
    measureGroupHeaderItems: Execution.IMeasureHeaderItem[],
    lastFieldType: string,
    lastFieldId: string | number,
): string[] {
    if (lastFieldType === FIELD_TYPE_MEASURE) {
        if (measureGroupHeaderItems.length === 0 || !measureGroupHeaderItems[lastFieldId]) {
            invariant(false, `Measure header with index ${lastFieldId} was not found`);
        }
        const {
            measureHeaderItem: { localIdentifier },
        } = measureGroupHeaderItems[lastFieldId];
        return [localIdentifier];
    } else if (lastFieldType === FIELD_TYPE_ATTRIBUTE) {
        return measureGroupHeaderItems.map(item => item.measureHeaderItem.localIdentifier);
    }
    invariant(false, `Unknown field type '${lastFieldType}' provided`);
}

function isTotalEnabledForAttribute(
    attributeLocalIdentifier: string,
    totalType: AFM.TotalType,
    columnTotals: IColumnTotal[],
): boolean {
    return columnTotals.some((total: IColumnTotal) => {
        return total.type === totalType && total.attributes.includes(attributeLocalIdentifier);
    });
}

function includeTotals(columnTotals: AFM.ITotalItem[], columnTotalsChanged: AFM.ITotalItem[]) {
    const columnTotalsChangedUnique = columnTotalsChanged.filter(
        totalChanged => !columnTotals.some(total => isEqual(total, totalChanged)),
    );

    return [...columnTotals, ...columnTotalsChangedUnique];
}

function excludeTotals(
    columnTotals: AFM.ITotalItem[],
    columnTotalsChanged: AFM.ITotalItem[],
): AFM.ITotalItem[] {
    return columnTotals.filter(
        total => !columnTotalsChanged.find(totalChanged => isEqual(totalChanged, total)),
    );
}

export function getUpdatedColumnTotals(
    columnTotals: AFM.ITotalItem[],
    menuAggregationClickConfig: IMenuAggregationClickConfig,
): AFM.ITotalItem[] {
    const { type, measureIdentifiers, attributeIdentifier, include } = menuAggregationClickConfig;

    const columnTotalsChanged = measureIdentifiers.map(measureIdentifier => ({
        type,
        measureIdentifier,
        attributeIdentifier,
    }));

    const updatedColumnTotals = include
        ? includeTotals(columnTotals, columnTotalsChanged)
        : excludeTotals(columnTotals, columnTotalsChanged);

    return sortBy(updatedColumnTotals, total =>
        AVAILABLE_TOTALS.findIndex((rankedItem: string) => rankedItem === total.type),
    );
}

export default {
    getTotalsForAttributeHeader,
    getTotalsForMeasureHeader,
    getHeaderMeasureLocalIdentifiers,
    isTotalEnabledForAttribute,
    getUpdatedColumnTotals,
};
