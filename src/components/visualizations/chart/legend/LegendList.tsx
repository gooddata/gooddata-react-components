// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import LegendItem from './LegendItem';
import { LEGEND_AXIS_INDICATOR, LEGEND_SEPARATOR } from './helpers';

export const LegendAxisIndicator = ({ text }: any) => (
    <div className="series-axis-indicator">
        <div className="series-text">
            {text}
        </div>
    </div>
);

export const LegendSeparator = () => (<div className="legend-separator"/>);

export default function LegendList(props: any) {
    const { series, chartType, onItemClick, width } = props;
    return (
        series.map((item: any, index: number) => {
            const { type, text } = item;
            if (type === LEGEND_AXIS_INDICATOR) {
                return <LegendAxisIndicator text={text} key={index}/>;
            } else if (type === LEGEND_SEPARATOR) {
                return <LegendSeparator key={index}/>;
            } else {
                return (
                    <LegendItem
                        chartType={chartType}
                        key={index}
                        item={item}
                        width={width}
                        onItemClick={onItemClick}
                    />
                );
            }
        })
    );
}
