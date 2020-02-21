// (C) 2020 GoodData Corporation
import * as React from "react";
import * as classNames from "classnames";
import {
    IColorLegendBox,
    IColorLegendConfig,
    IHeatmapLegendLabel as IColorLegendLabel,
    getColorLegendConfiguration,
} from "./helpers";
import { TOP } from "./PositionTypes";
import { IColorLegendItem } from "../../typings/legend";

export interface IColorLegendProps {
    data: IColorLegendItem[];
    numericSymbols: string[];
    position: string;
    isSmall?: boolean;
    format?: string;
}

interface IColorLabelsProps {
    labels: IColorLegendLabel[];
}

interface IColorBoxesProps {
    boxes: IColorLegendBox[];
}

export function ColorLabels(colorLabelProps: IColorLabelsProps): JSX.Element {
    const { labels } = colorLabelProps;
    return (
        <div className="labels">
            {labels.map(
                (item: IColorLegendLabel): JSX.Element => {
                    const { key, label, style } = item;
                    return (
                        <span key={key} style={style}>
                            {label}
                        </span>
                    );
                },
            )}
        </div>
    );
}

export function ColorBoxes(colorBoxProps: IColorBoxesProps): JSX.Element {
    const { boxes } = colorBoxProps;
    return (
        <div className="boxes">
            {boxes.map(
                (box: IColorLegendBox): JSX.Element => {
                    const classes = classNames("box", box.class);
                    const { key, style } = box;
                    return <span className={classes} key={key} style={style} />;
                },
            )}
        </div>
    );
}

export function ColorLegend(colorLegendProps: IColorLegendProps): JSX.Element {
    const { data, format, numericSymbols, isSmall = false, position } = colorLegendProps;

    const config: IColorLegendConfig = getColorLegendConfiguration(
        data,
        format,
        numericSymbols,
        isSmall,
        position,
    );
    const classes = classNames(...config.classes);
    const renderLabelsFirst = config.position === TOP;
    const { boxes, labels } = config;

    return (
        <div className={classes}>
            {renderLabelsFirst && <ColorLabels labels={labels} />}
            <ColorBoxes boxes={boxes} />
            {!renderLabelsFirst && <ColorLabels labels={labels} />}
        </div>
    );
}
