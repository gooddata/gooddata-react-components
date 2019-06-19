// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { factory } from "@gooddata/gooddata-js";
import { VisualizationObject, AFM } from "@gooddata/typings";
import { ScatterPlot, IScatterPlotProps } from "../ScatterPlot";
import { ScatterPlot as AfmScatterPlot } from "../afm/ScatterPlot";
import { M1 } from "./fixtures/buckets";
import { IChartConfig } from "../../interfaces/Config";

describe("ScatterPlot", () => {
    const measure: VisualizationObject.IMeasure = {
        measure: {
            localIdentifier: "m1",
            definition: {
                measureDefinition: {
                    item: {
                        identifier: "xyz123",
                    },
                },
            },
        },
    };

    const secondaryMeasure: VisualizationObject.IMeasure = {
        measure: {
            localIdentifier: "m2",
            definition: {
                measureDefinition: {
                    item: {
                        identifier: "abc321",
                    },
                },
            },
        },
    };

    const attribute: VisualizationObject.IVisualizationAttribute = {
        visualizationAttribute: {
            localIdentifier: "a1",
            displayForm: {
                identifier: "attribute1",
            },
        },
    };

    function renderChart(props: Partial<IScatterPlotProps>): ShallowWrapper {
        return shallow(<ScatterPlot xAxisMeasure={M1} projectId="foo" {...props} />);
    }

    it("should render with custom SDK", () => {
        const wrapper = renderChart({
            sdk: factory({ domain: "example.com" }),
        });
        expect(wrapper.find(AfmScatterPlot)).toHaveLength(1);
    });

    it("should render scatter plot and convert the buckets to AFM", () => {
        const wrapper = renderChart({
            xAxisMeasure: measure,
            yAxisMeasure: secondaryMeasure,
            attribute,
        });

        const expectedAfm: AFM.IAfm = {
            measures: [
                {
                    localIdentifier: "m1",
                    definition: {
                        measure: {
                            item: {
                                identifier: "xyz123",
                            },
                        },
                    },
                },
                {
                    localIdentifier: "m2",
                    definition: {
                        measure: {
                            item: {
                                identifier: "abc321",
                            },
                        },
                    },
                },
            ],
            attributes: [
                {
                    localIdentifier: "a1",
                    displayForm: {
                        identifier: "attribute1",
                    },
                },
            ],
        };

        expect(wrapper.find(AfmScatterPlot)).toHaveLength(1);
        expect(wrapper.find(AfmScatterPlot).prop("afm")).toEqual(expectedAfm);
    });

    describe("Separators", () => {
        const config: IChartConfig = { separators: { thousand: "'", decimal: "," } };

        it("should update format of measures", () => {
            const wrapper = renderChart({ config });
            expect(wrapper.find(AfmScatterPlot).prop("afm")).toEqual({
                measures: [
                    {
                        definition: {
                            measure: {
                                item: {
                                    identifier: "m1",
                                },
                            },
                        },
                        format: "#'##0,00",
                        localIdentifier: "m1",
                    },
                ],
            });
        });
    });
});
