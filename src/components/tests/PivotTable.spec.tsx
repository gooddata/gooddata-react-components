// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { factory } from "@gooddata/gooddata-js";
import { VisualizationObject, AFM } from "@gooddata/typings";
import { PivotTable } from "../PivotTable";
import { M1 } from "./fixtures/buckets";
import { IChartConfig } from "../../interfaces/Config";

describe("PivotTable", () => {
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

    function renderShallowComponent(customProps = {}): ShallowWrapper {
        return shallow(
            <PivotTable
                projectId="foo"
                measures={[M1]}
                sdk={factory({ domain: "example.com" })}
                {...customProps}
            />,
        );
    }

    it("should render with custom SDK", () => {
        const wrapper = renderShallowComponent();
        expect(wrapper).toHaveLength(1);
    });

    it("should render table and convert the buckets to AFM and resultSpec", () => {
        const wrapper = shallow(<PivotTable projectId="foo" measures={[measure]} rows={[attribute]} />);

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

        const expectedResultSpec = {
            dimensions: [
                {
                    itemIdentifiers: ["a1"],
                },
                {
                    itemIdentifiers: ["measureGroup"],
                },
            ],
        };

        expect(wrapper).toHaveLength(1);
        expect(wrapper.prop("afm")).toEqual(expectedAfm);
        expect(wrapper.prop("resultSpec")).toEqual(expectedResultSpec);
    });

    it("should render table and convert the buckets to AFM and resultSpec", () => {
        const wrapper = shallow(<PivotTable projectId="foo" measures={[measure]} rows={[attribute]} />);

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

        const expectedResultSpec = {
            dimensions: [
                {
                    itemIdentifiers: ["a1"],
                },
                {
                    itemIdentifiers: ["measureGroup"],
                },
            ],
        };

        expect(wrapper).toHaveLength(1);
        expect(wrapper.prop("afm")).toEqual(expectedAfm);
        expect(wrapper.prop("resultSpec")).toEqual(expectedResultSpec);
    });

    it("should render table with pivot buckets and convert the buckets to AFM and resultSpec", () => {
        const wrapper = shallow(
            <PivotTable projectId="foo" measures={[measure]} rows={[attribute]} columns={[attribute2]} />,
        );

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
                    itemIdentifiers: ["a1"],
                },
                {
                    itemIdentifiers: ["a2", "measureGroup"],
                },
            ],
        };

        expect(wrapper).toHaveLength(1);
        expect(wrapper.prop("afm")).toEqual(expectedAfm);
        expect(wrapper.prop("resultSpec")).toEqual(expectedResultSpec);
    });

    describe("Separators", () => {
        const config: IChartConfig = { separators: { thousand: "'", decimal: "," } };

        it("should update format of measures", () => {
            const wrapper = renderShallowComponent({ config });
            expect(wrapper.prop("afm")).toEqual({
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
