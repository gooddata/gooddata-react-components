// (C) 2020 GoodData Corporation
import * as React from "react";
import { shallow } from "enzyme";
import BulletChartConfigurationPanel from "../BulletChartConfigurationPanel";
import { IConfigurationPanelContentProps } from "../ConfigurationPanelContent";
import NameSubsection from "../../configurationControls/axis/NameSubsection";
import ConfigSection from "../../configurationControls/ConfigSection";
import { DEFAULT_LOCALE } from "../../../../constants/localization";
import { VisualizationTypes } from "../../../../constants/visualizationTypes";
import { attributeItemA1 } from "../../../mocks/visualizationObjectMocks";

describe("BulletChartConfigurationPanel", () => {
    function createComponent(props: IConfigurationPanelContentProps) {
        return shallow<IConfigurationPanelContentProps, null>(<BulletChartConfigurationPanel {...props} />, {
            lifecycleExperimental: true,
        });
    }

    it("should render configuration panel with enabled controls", () => {
        const mdObject = {
            buckets: [
                {
                    items: [
                        {
                            measure: {
                                definition: { measureDefinition: { item: { uri: "measure" } } },
                                localIdentifier: "measureId",
                            },
                        },
                    ],
                },
            ],
            visualizationClass: { uri: "visualization/class/uri" },
        };

        const props: IConfigurationPanelContentProps = {
            mdObject,
            isError: false,
            isLoading: false,
            locale: DEFAULT_LOCALE,
        };

        const wrapper = createComponent(props);
        const section = wrapper.find(ConfigSection).first();
        expect(section.props().toggleDisabled).toEqual(false);
    });

    it("should render configuration panel with disabled controls when it has no measures", () => {
        const mdObject = {
            buckets: [
                {
                    items: [
                        {
                            visualizationAttribute: {
                                displayForm: { uri: "df" },
                                localIdentifier: "attributeId",
                            },
                        },
                    ],
                },
            ],
            visualizationClass: { uri: "visualization/class/uri" },
        };

        const props: IConfigurationPanelContentProps = {
            mdObject,
            isError: false,
            isLoading: false,
            locale: DEFAULT_LOCALE,
        };

        const wrapper = createComponent(props);
        const section = wrapper.find(ConfigSection).first();
        expect(section.props().toggleDisabled).toEqual(true);
    });

    it("should render configuration panel with disabled controls when it is in error state", () => {
        const mdObject = {
            buckets: [
                {
                    items: [
                        {
                            measure: {
                                definition: { measureDefinition: { item: { uri: "measure" } } },
                                localIdentifier: "measureId",
                            },
                        },
                    ],
                },
            ],
            visualizationClass: { uri: "visualization/class/uri" },
        };

        const props: IConfigurationPanelContentProps = {
            mdObject,
            isError: true,
            isLoading: false,
            locale: DEFAULT_LOCALE,
        };

        const wrapper = createComponent(props);
        const section = wrapper.find(ConfigSection).first();
        expect(section.props().toggleDisabled).toEqual(true);
    });

    it("should render configuration panel with disabled controls when it is loading", () => {
        const mdObject = {
            buckets: [
                {
                    items: [
                        {
                            measure: {
                                definition: { measureDefinition: { item: { uri: "measure" } } },
                                localIdentifier: "measureId",
                            },
                        },
                    ],
                },
            ],
            visualizationClass: { uri: "visualization/class/uri" },
        };

        const props: IConfigurationPanelContentProps = {
            mdObject,
            isError: false,
            isLoading: true,
            locale: DEFAULT_LOCALE,
        };

        const wrapper = createComponent(props);
        const section = wrapper.find(ConfigSection).first();
        expect(section.props().toggleDisabled).toEqual(true);
    });

    describe("axis name configuration", () => {
        const defaultProps: IConfigurationPanelContentProps = {
            featureFlags: {
                enableAxisNameConfiguration: true,
            },
            isError: false,
            isLoading: false,
            locale: DEFAULT_LOCALE,
            type: VisualizationTypes.BULLET,
        };

        const closeBOPMeasure = {
            measure: {
                localIdentifier: "measure1",
                definition: {
                    measureDefinition: {
                        item: {
                            uri: "/gdc/md/projectId/obj/9211",
                        },
                    },
                },
            },
        };

        const visualizationClass = { uri: "/gdc/md/projectId/obj/76297" };

        it("should render configuration panel with enabled name sections", () => {
            const mdObject = {
                buckets: [
                    {
                        localIdentifier: "measures",
                        items: [closeBOPMeasure],
                    },
                    {
                        localIdentifier: "view",
                        items: [attributeItemA1],
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

        it("should render configuration panel with disabled name sections", () => {
            const mdObject = {
                buckets: [] as any,
                visualizationClass,
            };

            const wrapper = createComponent({
                ...defaultProps,
                mdObject,
            });

            const axisSections = wrapper.find(NameSubsection);

            const xAxisSection = axisSections.at(0);
            expect(xAxisSection.props().disabled).toBe(true);

            const yAxisSection = axisSections.at(1);
            expect(yAxisSection.props().disabled).toBe(true);
        });

        it("should render configuration panel with enabled X axis name section and disabled Y axis name section", () => {
            const mdObject = {
                buckets: [
                    {
                        localIdentifier: "measures",
                        items: [closeBOPMeasure],
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
            expect(xAxisSection.props().disabled).toBe(false);

            const yAxisSection = axisSections.at(1);
            expect(yAxisSection.props().disabled).toBe(true);
        });

        it("should not render name sections in configuration panel", () => {
            const mdObject = {
                buckets: [] as any,
                visualizationClass,
            };

            const wrapper = createComponent({
                ...defaultProps,
                featureFlags: {
                    enableAxisNameConfiguration: false,
                },
                mdObject,
            });

            const axisSections = wrapper.find(NameSubsection);
            expect(axisSections.exists()).toEqual(false);
        });
    });
});
