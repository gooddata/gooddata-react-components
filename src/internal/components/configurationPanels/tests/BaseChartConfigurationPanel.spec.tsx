// (C) 2019 GoodData Corporation
import * as React from "react";
import { shallow } from "enzyme";
import { VisualizationObject } from "@gooddata/typings";
import BaseChartConfigurationPanel from "../BaseChartConfigurationPanel";
import { IConfigurationPanelContentProps } from "../ConfigurationPanelContent";
import NameSubsection from "../../configurationControls/axis/NameSubsection";
import { DEFAULT_LOCALE } from "../../../../constants/localization";
import { VisualizationTypes } from "../../../..";

describe("BaseChartConfigurationPanel", () => {
    describe("axis name configuration", () => {
        function createComponent(props: IConfigurationPanelContentProps) {
            return shallow<IConfigurationPanelContentProps, null>(
                <BaseChartConfigurationPanel {...props} />,
                {
                    lifecycleExperimental: true,
                },
            );
        }

        const visualizationClass: VisualizationObject.IObjUriQualifier = {
            uri: "/gdc/md/projectId/obj/75535",
        };

        const productAttribute = {
            visualizationAttribute: {
                localIdentifier: "viewId",
                displayForm: { uri: "/gdc/md/projectId/obj/1024" },
            },
        };

        const regionAttribute = {
            visualizationAttribute: {
                localIdentifier: "viewId2",
                displayForm: { uri: "/gdc/md/projectId/obj/1025" },
            },
        };

        const closeBOPMeasure = {
            measure: {
                localIdentifier: "measureId",
                definition: {
                    measureDefinition: {
                        item: { uri: "/gdc/md/projectId/obj/9211" },
                    },
                },
            },
        };

        const closeEOPMeasure = {
            measure: {
                localIdentifier: "measureId2",
                definition: {
                    measureDefinition: {
                        item: { uri: "/gdc/md/projectId/obj/9203" },
                    },
                },
            },
        };

        const defaultProps: IConfigurationPanelContentProps = {
            isError: false,
            isLoading: false,
            locale: DEFAULT_LOCALE,
            type: VisualizationTypes.COLUMN,
        };

        it("should render configuration panel with enabled name sections in single axis chart", () => {
            const mdObject = {
                buckets: [
                    {
                        localIdentifier: "measures",
                        items: [closeBOPMeasure],
                    },
                    {
                        localIdentifier: "view",
                        items: [productAttribute],
                    },
                ],
                visualizationClass,
            };

            const wrapper = createComponent({
                ...defaultProps,
                mdObject,
            });

            const axisSections = wrapper.find(NameSubsection);

            const xAxisSection = axisSections.at(0);
            expect(xAxisSection.props().disabled).toEqual(false);

            const yAxisSection = axisSections.at(1);
            expect(yAxisSection.props().disabled).toEqual(false);
        });

        it("should render configuration panel with enabled name sections in dual axis chart", () => {
            const mdObject = {
                buckets: [
                    {
                        localIdentifier: "measures",
                        items: [closeBOPMeasure, closeEOPMeasure],
                    },
                    {
                        localIdentifier: "view",
                        items: [productAttribute],
                    },
                ],
                visualizationClass,
            };

            const wrapper = createComponent({
                ...defaultProps,
                mdObject,
                axis: "dual",
                properties: {
                    controls: {
                        secondary_yaxis: {
                            measures: ["measureId2"],
                        },
                    },
                },
            });

            const axisSections = wrapper.find(NameSubsection);

            const xAxisSection = axisSections.at(0);
            expect(xAxisSection.props().disabled).toEqual(false);

            const yAxisSection = axisSections.at(1);
            expect(yAxisSection.props().disabled).toEqual(false);

            const secondaryYAxisSection = axisSections.at(2);
            expect(secondaryYAxisSection.props().disabled).toEqual(false);
        });

        it("should render configuration panel with enabled X axis name section and disabled Y axis name section in single axis chart", () => {
            const mdObject = {
                buckets: [
                    {
                        localIdentifier: "measures",
                        items: [closeBOPMeasure, closeEOPMeasure],
                    },
                    {
                        localIdentifier: "view",
                        items: [productAttribute],
                    },
                ],
                visualizationClass,
            };

            const wrapper = createComponent({
                ...defaultProps,
                mdObject,
            });

            const axisSections = wrapper.find(NameSubsection);

            const xAxisSection = axisSections.at(0);
            expect(xAxisSection.props().disabled).toEqual(false);

            const yAxisSection = axisSections.at(1);
            expect(yAxisSection.props().disabled).toEqual(true); // because of 2 measures on Y axis
        });

        it("should render configuration panel with disabled X axis name section and disabled Y axis name section in group-category chart", () => {
            const mdObject = {
                buckets: [
                    {
                        localIdentifier: "measures",
                        items: [closeBOPMeasure, closeEOPMeasure],
                    },
                    {
                        localIdentifier: "view",
                        items: [productAttribute, regionAttribute],
                    },
                ],
                visualizationClass,
            };

            const wrapper = createComponent({
                ...defaultProps,
                mdObject,
            });

            const axisSections = wrapper.find(NameSubsection);

            const xAxisSection = axisSections.at(0);
            expect(xAxisSection.props().disabled).toEqual(true); // because of 2 attributes on X axis

            const yAxisSection = axisSections.at(1);
            expect(yAxisSection.props().disabled).toEqual(true); // because of 2 measures on Y axis
        });
    });
});
