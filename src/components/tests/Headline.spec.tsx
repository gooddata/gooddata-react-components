// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { factory } from "@gooddata/gooddata-js";
import { VisualizationObject, AFM } from "@gooddata/typings";
import { Headline, IHeadlineProps } from "../Headline";
import { Headline as AfmHeadline } from "../afm/Headline";
import { M1 } from "./fixtures/buckets";
import { IChartConfig } from "../../interfaces/Config";

describe("Headline", () => {
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

    function renderChart(props: Partial<IHeadlineProps>): ShallowWrapper {
        return shallow(<Headline primaryMeasure={M1} projectId="foo" {...props} />);
    }

    it("should render with custom SDK", () => {
        const wrapper = renderChart({
            sdk: factory({ domain: "example.com" }),
        });
        expect(wrapper.find(AfmHeadline)).toHaveLength(1);
    });

    it("should render headline with one measure and convert the bucket to AFM", () => {
        const wrapper = renderChart({
            primaryMeasure: measure,
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
        };

        expect(wrapper.find(AfmHeadline)).toHaveLength(1);
        expect(wrapper.find(AfmHeadline).prop("afm")).toEqual(expectedAfm);
    });

    it("should render headline with two measures and convert the bucket to AFM", () => {
        const secondaryMeasure: VisualizationObject.IMeasure = {
            measure: {
                localIdentifier: "m2",
                definition: {
                    measureDefinition: {
                        item: {
                            identifier: "abc123",
                        },
                    },
                },
            },
        };
        const wrapper = renderChart({
            primaryMeasure: measure,
            secondaryMeasure,
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
                                identifier: "abc123",
                            },
                        },
                    },
                },
            ],
        };

        expect(wrapper.find(AfmHeadline)).toHaveLength(1);
        expect(wrapper.find(AfmHeadline).prop("afm")).toEqual(expectedAfm);
    });

    describe("Separators", () => {
        const config: IChartConfig = { separators: { thousand: "'", decimal: "," } };

        it("should update format of measures", () => {
            const wrapper = renderChart({ config });
            expect(wrapper.find(AfmHeadline).prop("afm")).toEqual({
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
