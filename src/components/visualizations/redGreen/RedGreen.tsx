// (C) 2007-2018 GoodData Corporation
import * as React from "react";
import noop = require("lodash/noop");
import { AFM } from "@gooddata/typings";
import { IChartConfig } from "../../../interfaces/Config";
import { IRedGreenData } from "../../../interfaces/RedGreen";

export interface IRedGreenFiredDrillEventItemContext {
    localIdentifier: AFM.Identifier;
    value: string | null;
}

export type IRedGreenFiredDrillEvent = (
    itemContext?: IRedGreenFiredDrillEventItemContext,
    elementTarget?: EventTarget,
) => void;

export interface IRedGreenVisualizationProps {
    data: IRedGreenData;
    config?: IChartConfig;
    onFiredDrillEvent?: IRedGreenFiredDrillEvent;
    onAfterRender?: () => void;
}

/**
 * The React component that renders the RedGreen visualisation.
 */
export default class RedGreen extends React.Component<IRedGreenVisualizationProps> {
    public static defaultProps: Partial<IRedGreenVisualizationProps> = {
        onFiredDrillEvent: () => true,
        onAfterRender: noop,
        config: {},
    };

    public componentDidMount() {
        this.props.onAfterRender();
    }

    public componentDidUpdate() {
        this.props.onAfterRender();
    }

    public render() {
        const { value } = this.props.data;
        const limit = this.props.config.redGreenLimit;

        const parsedValue = Number.parseFloat(value);
        const parsedLimit = Number.parseFloat(limit || "0");
        const isGreen = parsedValue > parsedLimit;

        return (
            <div
                className="red-green"
                style={{ color: "white", backgroundColor: isGreen ? "green" : "red", padding: "1em" }}
            >
                <div>Limit: {limit}</div>
                <div>Value: {value}</div>
            </div>
        );
    }
}
