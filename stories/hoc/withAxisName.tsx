// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import merge = require("lodash/merge");
import Highcharts from "../../src/components/visualizations/chart/highcharts/highchartsEntryPoint";
import { createHighChartResolver, ScreenshotReadyWrapper } from "../utils/ScreenshotReadyWrapper";
import { IAxisNameConfig } from "../../src/interfaces/Config";

const wrapperStyle = { width: 800, height: 400 };

function getConfig(nameConfig: IAxisNameConfig) {
    const { visible = true, position = "middle" } = nameConfig;
    return {
        config: {
            xaxis: {
                name: {
                    visible,
                    position,
                },
            },
            secondary_xaxis: {
                name: {
                    visible,
                    position,
                },
            },
            yaxis: {
                name: {
                    visible,
                    position,
                },
            },
            secondary_yaxis: {
                name: {
                    visible,
                    position,
                },
            },
        },
    };
}

export function withAxisNamePositionConfig(element: JSX.Element): JSX.Element {
    return (
        <ScreenshotReadyWrapper resolver={createHighChartResolver(3)}>
            <div>
                {["low", "middle", "high"].map((position: Highcharts.AxisTitleAlignValue) => {
                    const positionConfig = getConfig({ position });
                    return (
                        <>
                            <div className="storybook-title">axis name position = {position}</div>
                            <div style={wrapperStyle}>
                                <element.type {...merge({}, element.props, positionConfig)} key={position}>
                                    {element.props.children}
                                </element.type>
                            </div>
                        </>
                    );
                })}
            </div>
        </ScreenshotReadyWrapper>
    );
}

export function withAxisNameVisibilityConfig(element: JSX.Element): JSX.Element {
    return (
        <ScreenshotReadyWrapper resolver={createHighChartResolver(3)}>
            <div>
                {[false, true].map((visible: boolean) => {
                    const visibilityConfig = getConfig({ visible });
                    return (
                        <>
                            <div className="storybook-title">axis name visibility = {String(visible)}</div>
                            <div style={wrapperStyle}>
                                <element.type {...merge({}, element.props, visibilityConfig)}>
                                    {element.props.children}
                                </element.type>
                            </div>
                        </>
                    );
                })}
            </div>
        </ScreenshotReadyWrapper>
    );
}
