// (C) 2019 GoodData Corporation
import * as React from "react";
import merge = require("lodash/merge");
import { createHighChartResolver, ScreenshotReadyWrapper } from "../utils/ScreenshotReadyWrapper";
import { ChartAlignTypes } from "../../src/interfaces/Config";
import { BOTTOM, MIDDLE, TOP } from "../../src/constants/alignments";

const wrapperStyle = { width: 300, height: 600 };

function getConfig(alignType: ChartAlignTypes) {
    return {
        config: {
            chart: {
                verticalAlign: alignType,
            },
        },
    };
}

export function withChartAlignmentConfigs(element: JSX.Element): JSX.Element {
    return (
        <ScreenshotReadyWrapper resolver={createHighChartResolver(3)}>
            <div style={{ width: 905 }}>
                {[TOP, MIDDLE, BOTTOM].map((alignType: ChartAlignTypes, index: number) => {
                    const config = getConfig(alignType);
                    const containerStyle = {
                        display: "inline-block",
                        borderRight: index === 2 ? "" : "1px dashed pink",
                    };
                    return (
                        <div key={alignType} style={containerStyle}>
                            <div className="storybook-title">chart alignment = {alignType}</div>
                            <div style={wrapperStyle}>
                                <element.type {...merge({}, element.props, config)} key={alignType}>
                                    {element.props.children}
                                </element.type>
                            </div>
                        </div>
                    );
                })}
            </div>
        </ScreenshotReadyWrapper>
    );
}
