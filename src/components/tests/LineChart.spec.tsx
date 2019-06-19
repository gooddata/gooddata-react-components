// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { factory } from "@gooddata/gooddata-js";
import { VisualizationObject, AFM } from "@gooddata/typings";
import { LineChart, ILineChartProps } from "../LineChart";
import { LineChart as AfmLineChart } from "../afm/LineChart";
import { M1 } from "./fixtures/buckets";
import { IChartConfig } from "../../interfaces/Config";

describe("LineChart", () => {
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

    const attribute: VisualizationObject.IVisualizationAttribute = {
        visualizationAttribute: {
            localIdentifier: "a1",
            displayForm: {
                identifier: "attribute1",
            },
        },
    };

    const attribute2: VisualizationObject.IVisualizationAttribute = {
        visualizationAttribute: {
            localIdentifier: "a2",
            displayForm: {
                identifier: "attribute2",
            },
        },
    };

    const measureSortItem: AFM.IMeasureSortItem = {
        measureSortItem: {
            direction: "asc",
            locators: [
                {
                    measureLocatorItem: {
                        measureIdentifier: "m1",
                    },
                },
            ],
        },
    };

    function renderChart(props: Partial<ILineChartProps>): ShallowWrapper {
        return shallow(<LineChart measures={[M1]} projectId="foo" {...props} />);
    }

    it("should render with custom SDK", () => {
        const wrapper = renderChart({
            sdk: factory({ domain: "example.com" }),
        });
        expect(wrapper.find(AfmLineChart)).toHaveLength(1);
    });

    it("should render pie chart and convert the buckets to AFM", () => {
        const wrapper = renderChart({
            measures: [measure],
            trendBy: attribute,
            segmentBy: attribute2,
            sortBy: [measureSortItem],
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
            ],
            attributes: [
                {
                    localIdentifier: "a1",
                    displayForm: {
                        identifier: "attribute1",
                    },
                },
                {
                    localIdentifier: "a2",
                    displayForm: {
                        identifier: "attribute2",
                    },
                },
            ],
        };

        const expectedResultSpec = {
            dimensions: [
                {
                    itemIdentifiers: ["a2"],
                },
                {
                    itemIdentifiers: ["a1", "measureGroup"],
                },
            ],
            sorts: [
                {
                    measureSortItem: {
                        direction: "asc",
                        locators: [
                            {
                                measureLocatorItem: {
                                    measureIdentifier: "m1",
                                },
                            },
                        ],
                    },
                },
            ],
        };

        expect(wrapper.find(AfmLineChart)).toHaveLength(1);
        expect(wrapper.find(AfmLineChart).prop("afm")).toEqual(expectedAfm);
        expect(wrapper.find(AfmLineChart).prop("resultSpec")).toEqual(expectedResultSpec);
    });

    describe("Separators", () => {
        const config: IChartConfig = { separators: { thousand: "'", decimal: "," } };

        it("should update format of measures", () => {
            const wrapper = renderChart({ config });
            expect(wrapper.find(AfmLineChart).prop("afm")).toEqual({
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
