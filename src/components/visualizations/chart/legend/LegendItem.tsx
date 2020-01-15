// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import unescape = require("lodash/unescape");

import { isLineChart, isAreaChart, isComboChart } from "../../utils/common";

const VISIBLE_COLOR = "#6D7680";
const DISABLED_COLOR = "#CCCCCC";

export default class LegendItem extends React.Component<any, any> {
    public static defaultProps: any = {
        width: null,
        interactive: true,
    };

    public render() {
        const { item, chartType, width, interactive } = this.props;
        const itemChartType = isComboChart(chartType) ? item.type : chartType;
        const enableBorderRadius = isLineChart(itemChartType) || isAreaChart(itemChartType);

        const cursorStyle = !interactive ? "initial" : "";

        const iconStyle = {
            borderRadius: enableBorderRadius ? "50%" : "0",
            backgroundColor: item.isVisible ? item.color : DISABLED_COLOR,
            cursor: cursorStyle,
        };

        const nameStyle = {
            color: item.isVisible ? VISIBLE_COLOR : DISABLED_COLOR,
            cursor: cursorStyle,
        };

        const style = {
            width: width ? `${width}px` : "inherit",
            cursor: cursorStyle,
        };

        const onItemClick = () => {
            if (interactive) {
                this.props.onItemClick(item);
            }
        };

        return (
            <div style={style} className="series-item" onClick={onItemClick}>
                <div className="series-icon" style={iconStyle} />
                <div className="series-name" style={nameStyle} title={unescape(item.name)}>
                    {item.name}
                </div>
            </div>
        );
    }
}
