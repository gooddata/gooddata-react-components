// (C) 2019 GoodData Corporation
import { Execution, AFM } from "@gooddata/typings";
import cloneDeep = require("lodash/cloneDeep");
import get = require("lodash/get");
import isEmpty = require("lodash/isEmpty");
import zip = require("lodash/zip");
import * as invariant from "invariant";

import { calculateXirr, IXirrInput } from "./calculateXirr";
import { IHeadlineData } from "../../../../interfaces/Headlines";
import { isSomeHeaderPredicateMatched } from "../../../../helpers/headerPredicate";
import { IHeaderPredicate } from "../../../../interfaces/HeaderPredicate";
import { VisualizationTypes } from "../../../../constants/visualizationTypes";
import {
    IDrillEventIntersectionElementExtended,
    IDrillEventExtended,
    IDrillEventContextXirrExtended,
} from "../../../../interfaces/DrillEvents";
import { IHeadlineDrillItemContext } from "../types";

const getExecutionResponseMeasureHeader = (
    executionResponse: Execution.IExecutionResponse,
): Execution.IMeasureHeaderItem =>
    get(executionResponse, ["dimensions", 0, "headers", 0, "measureGroupHeader", "items", 0], {
        measureHeaderItem: null,
    });

const computeXirr = (executionResult: Execution.IExecutionResult): number => {
    // prevent errors on invalid inputs
    if (!executionResult.headerItems[0][1] || !executionResult.data) {
        return NaN;
    }

    const values = executionResult.data as string[];
    const parsedValues = values.map(value => Number.parseFloat(value));

    const dates = executionResult.headerItems[0][1].map(
        (h: Execution.IResultAttributeHeaderItem) => h.attributeHeaderItem.name,
    );

    const transactions: IXirrInput[] = zip(parsedValues, dates)
        .filter(([value]) => value !== 0) // zero values are irrelevant to XIRR computation, filter them out here to avoid useless Date parsing later
        .map(([amount, date]) => ({
            amount,
            when: new Date(date),
        }));

    return calculateXirr(transactions);
};

/**
 * Get {HeadlineData} used by the {Headline} component.
 *
 * @param executionResponse - The execution response with dimensions definition.
 * @param executionResult - The execution result with an actual data values.
 */
export function getHeadlineData(
    executionResponse: Execution.IExecutionResponse,
    executionResult: Execution.IExecutionResult,
): IHeadlineData {
    const { measureHeaderItem } = getExecutionResponseMeasureHeader(executionResponse);

    const value = computeXirr(executionResult);

    invariant(value !== undefined, "Undefined execution value data for XIRR transformation");
    invariant(measureHeaderItem, "Missing expected measureHeaderItem");

    return {
        primaryItem: {
            localIdentifier: measureHeaderItem.localIdentifier,
            title: measureHeaderItem.name,
            value: value ? String(value) : null,
            format: measureHeaderItem.format,
            isDrillable: false,
        },
    };
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
    const { primaryItem } = data;
    const itemHeader = getExecutionResponseMeasureHeader(executionResponse);

    if (!isEmpty(primaryItem) && !isEmpty(itemHeader)) {
        primaryItem.isDrillable = isSomeHeaderPredicateMatched(
            drillableItems,
            itemHeader,
            executionRequest.afm,
            executionResponse,
        );
    }

    return data;
}

/**
 * Build drill event data (object with execution and drill context) from the data obtained by clicking on the {Xirr}
 * component an from the execution objects.
 *
 * @param itemContext - data received from the click on the {Xirr} component.
 * @param executionRequest - The execution request with AFM and ResultSpec.
 * @param executionResponse - The execution response with dimensions definition.
 * @returns {*}
 */
export function buildDrillEventData(
    itemContext: IHeadlineDrillItemContext,
    executionRequest: AFM.IExecution["execution"],
    executionResponse: Execution.IExecutionResponse,
): IDrillEventExtended {
    const { measureHeaderItem } = getExecutionResponseMeasureHeader(executionResponse);
    if (!measureHeaderItem) {
        throw new Error("The measure uri has not been found in execution response!");
    }

    const intersectionElement: IDrillEventIntersectionElementExtended = {
        header: {
            measureHeaderItem,
        },
    };
    const drillContext: IDrillEventContextXirrExtended = {
        type: VisualizationTypes.XIRR,
        element: "primaryValue",
        value: itemContext.value,
        intersection: [intersectionElement],
    };

    return {
        executionContext: executionRequest.afm,
        drillContext,
    };
}
