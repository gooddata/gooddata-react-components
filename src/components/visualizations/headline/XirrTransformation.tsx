// (C) 2019 GoodData Corporation
import * as React from "react";
import { WrappedComponentProps, injectIntl } from "react-intl";
import noop = require("lodash/noop");

import { IDrillEvent, IDrillEventExtended } from "../../../interfaces/DrillEvents";
import Headline, { IHeadlineFiredDrillEventItemContext } from "../headline/Headline";
import { convertHeadlineDrillIntersectionToLegacy, fireDrillEvent } from "../utils/drilldownEventing";
import { convertDrillableItemsToPredicates } from "../../../helpers/headerPredicate";
import { getHeadlineData, applyDrillableItems, buildDrillEventData } from "./utils/XirrTransformationUtils";
import { IHeadlineTransformationProps } from "./types";

class XirrTransformation extends React.Component<IHeadlineTransformationProps & WrappedComponentProps> {
    public static defaultProps: Partial<IHeadlineTransformationProps & WrappedComponentProps> = {
        drillableItems: [],
        onFiredDrillEvent: () => true,
        onDrill: noop,
        onAfterRender: noop,
    };

    public render(): React.ReactNode {
        const {
            executionRequest,
            executionResponse,
            executionResult,
            drillableItems,
            config,
            onAfterRender,
        } = this.props;

        const drillablePredicates = convertDrillableItemsToPredicates(drillableItems);
        const data = getHeadlineData(executionResponse, executionResult);
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

    private getDisableDrillUnderlineFromConfig = (): boolean =>
        this.props.config ? this.props.config.disableDrillUnderline : false;

    // legacy drill handling
    private handleFiredDrillEvent = (item: IHeadlineFiredDrillEventItemContext, target: HTMLElement) => {
        const { onFiredDrillEvent, executionRequest, executionResponse } = this.props;
        const drillEventDataExtended: IDrillEventExtended = buildDrillEventData(
            item,
            executionRequest,
            executionResponse,
        );
        const { executionContext, drillContext } = drillEventDataExtended;
        const { type, element, value } = drillContext;
        const drillEventDataOld: IDrillEvent = {
            executionContext,
            drillContext: {
                type,
                element,
                value,
                intersection: convertHeadlineDrillIntersectionToLegacy(
                    drillContext.intersection,
                    executionRequest.afm,
                ),
            },
        };
        fireDrillEvent(onFiredDrillEvent, drillEventDataOld, target);
    };

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

export default injectIntl(XirrTransformation);
