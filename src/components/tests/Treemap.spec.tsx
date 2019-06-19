// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { factory } from "@gooddata/gooddata-js";
import { VisualizationObject, AFM } from "@gooddata/typings";
import { Treemap, ITreemapProps } from "../Treemap";
import { Treemap as AfmTreemap } from "../afm/Treemap";
import { M1 } from "./fixtures/buckets";
import { IChartConfig } from "../../interfaces/Config";

describe("Treemap", () => {
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

    function renderChart(props: Partial<ITreemapProps>): ShallowWrapper {
        return shallow(<Treemap measures={[M1]} projectId="foo" {...props} />);
    }

    it("should render with custom SDK", () => {
        const wrapper = renderChart({
            sdk: factory({ domain: "example.com" }),
        });
        expect(wrapper.find(AfmTreemap)).toHaveLength(1);
    });

    it("should render treemap and convert the buckets to AFM", () => {
        const wrapper = renderChart({
            measures: [measure],
            viewBy: attribute,
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
            ],
        };

        expect(wrapper.find(AfmTreemap)).toHaveLength(1);
        expect(wrapper.find(AfmTreemap).prop("afm")).toEqual(expectedAfm);
    });

    describe("Separators", () => {
        const config: IChartConfig = { separators: { thousand: "'", decimal: "," } };

        it("should update format of measures", () => {
            const wrapper = renderChart({ config });
            expect(wrapper.find(AfmTreemap).prop("afm")).toEqual({
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
