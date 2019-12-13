// (C) 2007-2019 GoodData Corporation
import cloneDeep = require("lodash/cloneDeep");
import get = require("lodash/get");
import isEmpty = require("lodash/isEmpty");
import isNumber = require("lodash/isNumber");
import * as invariant from "invariant";
import { AFM, Execution } from "@gooddata/typings";
import { IntlShape } from "react-intl";
import { isSomeHeaderPredicateMatched } from "../../../../helpers/headerPredicate";
import { IHeaderPredicate } from "../../../../interfaces/HeaderPredicate";
import {
    IDrillEventIntersectionElementExtended,
    IDrillEventExtended,
    IDrillEventContextHeadlineExtended,
} from "../../../../interfaces/DrillEvents";
import { VisualizationTypes } from "../../../../constants/visualizationTypes";
import { IHeadlineData, IHeadlineDataItem } from "../../../../interfaces/Headlines";
import { IHeadlineDrillItemContext } from "../types";

export interface IHeadlineExecutionData {
    measureHeaderItem: Execution.IMeasureHeaderItem["measureHeaderItem"];
    value: Execution.DataValue;
}

function createHeadlineDataItem(executionDataItem: IHeadlineExecutionData): IHeadlineDataItem {
    if (!executionDataItem) {
        return null;
    }

    return {
        localIdentifier: executionDataItem.measureHeaderItem.localIdentifier,
        title: executionDataItem.measureHeaderItem.name,
        value: executionDataItem.value ? String(executionDataItem.value) : null,
        format: executionDataItem.measureHeaderItem.format,
        isDrillable: false,
    };
}

function createTertiaryItem(executionData: IHeadlineExecutionData[], intl: IntlShape): IHeadlineDataItem {
    const secondaryHeaderItem = get(executionData, [1, "measureHeaderItem"]);
    if (!secondaryHeaderItem) {
        return null;
    }

    const primaryValueString = get(executionData, [0, "value"]);
    const primaryValue = primaryValueString !== null ? Number(primaryValueString) : null;
    const secondaryValueString = get(executionData, [1, "value"]);
    const secondaryValue = secondaryValueString !== null ? Number(secondaryValueString) : null;

    const tertiaryTitle = intl.formatMessage({ id: "visualizations.headline.tertiary.title" });

    const isCountableValue = isNumber(primaryValue) && isNumber(secondaryValue);
    const tertiaryValue =
        isCountableValue && secondaryValue !== 0
            ? ((primaryValue - secondaryValue) / secondaryValue) * 100
            : null;

    return {
        localIdentifier: "tertiaryIdentifier",
        title: tertiaryTitle,
        value: tertiaryValue !== null ? String(tertiaryValue) : null,
        format: null,
        isDrillable: false,
    };
}

function getExecutionResponseMeasureHeaders(
    executionResponse: Execution.IExecutionResponse,
): Execution.IMeasureHeaderItem[] {
    return get(executionResponse, ["dimensions", 0, "headers", 0, "measureGroupHeader", "items"], []);
}

/**
 * Get tuple of measure header items with related data value by index position from executionResponse and
 * executionResult.
 *
 * @param executionResponse
 * @param executionResult
 * @returns {any[]}
 */
function getExecutionData(
    executionResponse: Execution.IExecutionResponse,
    executionResult: Execution.IExecutionResult,
): IHeadlineExecutionData[] {
    const headerItems = getExecutionResponseMeasureHeaders(executionResponse);

    return headerItems.map((item, index) => {
        const value = get(executionResult, ["data", index]);

        invariant(value !== undefined, "Undefined execution value data for headline transformation");
        invariant(item.measureHeaderItem, "Missing expected measureHeaderItem");

        return {
            measureHeaderItem: item.measureHeaderItem,
            value,
        };
    });
}

/**
 * Get {HeadlineData} used by the {Headline} component.
 *
 * @param executionResponse - The execution response with dimensions definition.
 * @param executionResult - The execution result with an actual data values.
 * @param intl - Required localization for compare item title
 * @returns {*}
 */
export function getHeadlineData(
    executionResponse: Execution.IExecutionResponse,
    executionResult: Execution.IExecutionResult,
    intl: IntlShape,
): IHeadlineData {
    const executionData = getExecutionData(executionResponse, executionResult);

    const primaryItem = createHeadlineDataItem(executionData[0]);

    const secondaryItem = createHeadlineDataItem(executionData[1]);
    const secondaryItemProp = secondaryItem ? { secondaryItem } : {};

    const tertiaryItem = createTertiaryItem(executionData, intl);
    const tertiaryItemProp = tertiaryItem ? { tertiaryItem } : {};

    return {
        primaryItem,
        ...secondaryItemProp,
        ...tertiaryItemProp,
    };
}

function findMeasureHeaderItem(
    localIdentifier: AFM.Identifier,
    executionResponse: Execution.IExecutionResponse,
) {
    const measureGroupHeaderItems = getExecutionResponseMeasureHeaders(executionResponse);
    return measureGroupHeaderItems
        .map(item => item.measureHeaderItem)
        .find(header => header !== undefined && header.localIdentifier === localIdentifier);
}

/**
 * Take headline data and apply list of drillable items.
 * The method will return copied collection of the headline data with altered drillable status.
 *
 * @param headlineData - The headline data that we want to change the drillable status.
 * @param drillableItems - list of drillable items {uri, identifier}
 * @param executionRequest - Request with required measure id (uri or identifier) for activation of drill eventing
 * @param executionResponse - Response headers for drilling predicate matching
 * @returns altered headlineData
 */
export function applyDrillableItems(
    headlineData: IHeadlineData,
    drillableItems: IHeaderPredicate[],
    executionRequest: AFM.IExecution["execution"],
    executionResponse: Execution.IExecutionResponse,
): IHeadlineData {
    const data = cloneDeep(headlineData);
    const { primaryItem, secondaryItem } = data;
    const [primaryItemHeader, secondaryItemHeader] = getExecutionResponseMeasureHeaders(executionResponse);

    if (!isEmpty(primaryItem) && !isEmpty(primaryItemHeader)) {
        primaryItem.isDrillable = isSomeHeaderPredicateMatched(
            drillableItems,
            primaryItemHeader,
            executionRequest.afm,
            executionResponse,
        );
    }

    if (!isEmpty(secondaryItem) && !isEmpty(secondaryItemHeader)) {
        secondaryItem.isDrillable = isSomeHeaderPredicateMatched(
            drillableItems,
            secondaryItemHeader,
            executionRequest.afm,
            executionResponse,
        );
    }

    return data;
}

/**
 * Build drill event data (object with execution and drill context) from the data obtained by clicking on the {Headline}
 * component an from the execution objects.
 *
 * @param itemContext - data received from the click on the {Headline} component.
 * @param executionRequest - The execution request with AFM and ResultSpec.
 * @param executionResponse - The execution response with dimensions definition.
 * @returns {*}
 */
export function buildDrillEventData(
    itemContext: IHeadlineDrillItemContext,
    executionRequest: AFM.IExecution["execution"],
    executionResponse: Execution.IExecutionResponse,
): IDrillEventExtended {
    const measureHeaderItem = findMeasureHeaderItem(itemContext.localIdentifier, executionResponse);
    if (!measureHeaderItem) {
        throw new Error("The measure uri has not been found in execution response!");
    }

    const intersectionElement: IDrillEventIntersectionElementExtended = {
        header: {
            measureHeaderItem,
        },
    };
    const drillContext: IDrillEventContextHeadlineExtended = {
        type: VisualizationTypes.HEADLINE,
        element: itemContext.element,
        value: itemContext.value,
        intersection: [intersectionElement],
    };

    return {
        executionContext: executionRequest.afm,
        drillContext,
    };
}
