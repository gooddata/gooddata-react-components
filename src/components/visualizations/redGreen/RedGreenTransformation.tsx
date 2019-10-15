// (C) 2007-2018 GoodData Corporation
import { AFM, Execution } from "@gooddata/typings";
import * as React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import noop = require("lodash/noop");
import { IChartConfig } from "../../../interfaces/Config";
import { IDrillableItem, IDrillEventCallback } from "../../../interfaces/DrillEvents";
import { IHeaderPredicate } from "../../../interfaces/HeaderPredicate";
import RedGreen from "./RedGreen";
import { IRedGreenData } from "../../../interfaces/RedGreen";

export interface IRedGreenTransformationProps {
    executionRequest: AFM.IExecution["execution"];
    executionResponse: Execution.IExecutionResponse;
    executionResult: Execution.IExecutionResult;

    drillableItems?: Array<IDrillableItem | IHeaderPredicate>;
    config?: IChartConfig;

    onFiredDrillEvent?: IDrillEventCallback;
    onAfterRender?: () => void;
}

/**
 * The React component that handles the transformation of the execution objects into the data accepted by the {Headline}
 * React component that this components wraps. It also handles the propagation of the drillable items to the component
 * and drill events out of it.
 */
class RedGreenTransformation extends React.Component<IRedGreenTransformationProps & InjectedIntlProps> {
    public static defaultProps: Partial<IRedGreenTransformationProps> = {
        drillableItems: [],
        onFiredDrillEvent: () => true,
        onAfterRender: noop,
    };

    // constructor(props: IHeadlineTransformationProps & InjectedIntlProps) {
    //     super(props);

    //     this.handleFiredDrillEvent = this.handleFiredDrillEvent.bind(this);
    // }

    public render() {
        const { executionResult, config, onAfterRender } = this.props;

        // const data = getHeadlineData(executionResponse, executionResult, intl);
        // const drillablePredicates = convertDrillableItemsToPredicates(drillableItems);
        // const dataWithUpdatedDrilling = applyDrillableItems(
        //     data,
        //     drillablePredicates,
        //     executionRequest,
        //     executionResponse,
        // );

        const data: IRedGreenData = {
            value: executionResult.data[0].toString(),
        };

        return (
            <RedGreen
                data={data}
                config={config}
                // onFiredDrillEvent={this.handleFiredDrillEvent}
                onAfterRender={onAfterRender}
            />
        );
    }

    // private handleFiredDrillEvent(item: IHeadlineFiredDrillEventItemContext, target: HTMLElement) {
    //     const { onFiredDrillEvent, executionRequest, executionResponse } = this.props;
    //     const drillEventData = buildDrillEventData(item, executionRequest, executionResponse);

    //     fireDrillEvent(onFiredDrillEvent, drillEventData, target);
    // }
}

export default injectIntl(RedGreenTransformation);
