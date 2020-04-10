// (C) 2020 GoodData Corporation
import { Execution } from "@gooddata/typings";
import { findAttributeInDimension } from "../executionResultHelper";
import { IUnwrappedAttributeHeaderWithItems } from "../../components/visualizations/typings/chart";
import { IGeoData } from "../../interfaces/GeoChart";

export interface IGeoAttributesInDimension {
    locationAttribute: IUnwrappedAttributeHeaderWithItems;
    segmentByAttribute: IUnwrappedAttributeHeaderWithItems;
}

export function findGeoAttributesInDimension(
    execution: Execution.IExecutionResponses,
    geoData: IGeoData,
): IGeoAttributesInDimension {
    const {
        executionResponse: { dimensions },
        executionResult: { headerItems },
    } = execution;
    const { color, location, segment, size } = geoData;

    const hasMeasure = size || color;
    const attrDimensionIndex = hasMeasure ? 1 : 0;
    const attributeDimension: Execution.IResultDimension = dimensions[attrDimensionIndex];
    const attributeResultHeaderItems: Execution.IResultHeaderItem[][] = headerItems[attrDimensionIndex];

    const locationAttribute: IUnwrappedAttributeHeaderWithItems = findAttributeInDimension(
        attributeDimension,
        attributeResultHeaderItems,
        location.index,
    );

    const segmentByAttribute: IUnwrappedAttributeHeaderWithItems =
        segment && segment.data.length
            ? findAttributeInDimension(attributeDimension, attributeResultHeaderItems, segment.index)
            : undefined;

    return {
        locationAttribute,
        segmentByAttribute,
    };
}
