// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import { WrappedComponentProps, injectIntl } from "react-intl";
import noop = require("lodash/noop");
import { convertDrillableItemsToPredicates } from "../../../helpers/headerPredicate";
import { IDrillEventExtended, IDrillEvent } from "../../../interfaces/DrillEvents";
import Headline, { IHeadlineFiredDrillEventItemContext } from "./Headline";
import {
    applyDrillableItems,
    buildDrillEventData,
    getHeadlineData,
} from "./utils/HeadlineTransformationUtils";
import { fireDrillEvent } from "../utils/drilldownEventing";
import { convertDrillContextToLegacy } from "../utils/drilldownEventingLegacy";
import { IHeadlineTransformationProps } from "./types";

/**
 * The React component that handles the transformation of the execution objects into the data accepted by the {Headline}
 * React component that this components wraps. It also handles the propagation of the drillable items to the component
 * and drill events out of it.
 */
class HeadlineTransformation extends React.Component<IHeadlineTransformationProps & WrappedComponentProps> {
    public static defaultProps: Partial<IHeadlineTransformationProps & WrappedComponentProps> = {
        drillableItems: [],
        onFiredDrillEvent: () => true,
        onDrill: noop,
        onAfterRender: noop,
    };

    constructor(props: IHeadlineTransformationProps & WrappedComponentProps) {
        super(props);

        this.handleFiredDrillEvent = this.handleFiredDrillEvent.bind(this);
    }

    public render() {
        const {
            intl,
            executionRequest,
            executionResponse,
            executionResult,
            drillableItems,
            config,
            onAfterRender,
        } = this.props;

        const data = getHeadlineData(executionResponse, executionResult, intl);
        const drillablePredicates = convertDrillableItemsToPredicates(drillableItems);
        const dataWithUpdatedDrilling = applyDrillableItems(
            data,
            drillablePredicates,
            executionRequest,
            executionResponse,
        );
        const disableDrillUnderline = this.getDisableDrillUnderlineFromConfig();
        return (
            <Headline
                data={dataWithUpdatedDrilling}
                config={config}
                onFiredDrillEvent={this.handleFiredDrillEvent}
                onDrill={this.handleOnDrill}
                onAfterRender={onAfterRender}
                disableDrillUnderline={disableDrillUnderline}
            />
        );
    }

    private getDisableDrillUnderlineFromConfig() {
        if (this.props.config) {
            return this.props.config.disableDrillUnderline;
        }
    }

    // legacy drill handling
    private handleFiredDrillEvent(item: IHeadlineFiredDrillEventItemContext, target: HTMLElement) {
        const { onFiredDrillEvent, executionRequest, executionResponse } = this.props;
        const drillEventDataExtended: IDrillEventExtended = buildDrillEventData(
            item,
            executionRequest,
            executionResponse,
        );
        const { executionContext, drillContext } = drillEventDataExtended;
        const drillEventDataOld: IDrillEvent = {
            executionContext,
            drillContext: convertDrillContextToLegacy(drillContext, executionContext),
        };
        fireDrillEvent(onFiredDrillEvent, drillEventDataOld, target);
    }

    private handleOnDrill = (item: IHeadlineFiredDrillEventItemContext) => {
        const { executionRequest, executionResponse, onDrill } = this.props;
        const drillEventDataExtended: IDrillEventExtended = buildDrillEventData(
            item,
            executionRequest,
            executionResponse,
        );

        onDrill(drillEventDataExtended);
    };
}

export default injectIntl(HeadlineTransformation);
