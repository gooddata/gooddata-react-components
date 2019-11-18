// (C) 2007-2019 GoodData Corporation
import { AFM, Execution } from "@gooddata/typings";
import { IChartConfig } from "../../../interfaces/Config";
import {
    IDrillableItem,
    IDrillEventCallback,
    IDrillEventExtendedCallback,
} from "../../../interfaces/DrillEvents";
import { IHeaderPredicate } from "../../../interfaces/HeaderPredicate";
import { HeadlineElementType } from "../../../constants/visualizationTypes";

export interface IHeadlineTransformationProps {
    executionRequest: AFM.IExecution["execution"];
    executionResponse: Execution.IExecutionResponse;
    executionResult: Execution.IExecutionResult;

    drillableItems?: Array<IDrillableItem | IHeaderPredicate>;
    config?: IChartConfig;

    onFiredDrillEvent?: IDrillEventCallback;
    onDrill?: IDrillEventExtendedCallback;
    onAfterRender?: () => void;
}

export interface IHeadlineDrillItemContext {
    localIdentifier: AFM.Identifier;
    value: string;
    element: HeadlineElementType;
}
