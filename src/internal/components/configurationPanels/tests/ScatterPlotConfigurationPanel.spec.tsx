// (C) 2019 GoodData Corporation
import * as React from "react";
import { shallow } from "enzyme";
import ScatterPlotConfigurationPanel from "../ScatterPlotConfigurationPanel";
import { IConfigurationPanelContentProps } from "../ConfigurationPanelContent";
import ConfigSection from "../../configurationControls/ConfigSection";
import NameSubsection from "../../configurationControls/axis/NameSubsection";
import { DEFAULT_LOCALE } from "../../../../constants/localization";
import { VisualizationTypes } from "../../../..";

describe("ScatterPlotConfigurationPanel", () => {
    function createComponent(
        props: IConfigurationPanelContentProps = {
            locale: DEFAULT_LOCALE,
        },
    ) {
        return shallow<IConfigurationPanelContentProps, null>(<ScatterPlotConfigurationPanel {...props} />, {
            lifecycleExperimental: true,
        });
    }

    it("should render three sections in configuration panel for bubble chart", () => {
        const wrapper = createComponent();

        expect(wrapper.find(ConfigSection).length).toBe(3);
    });

    describe("axis name configuration", () => {
        const defaultProps: IConfigurationPanelContentProps = {
            isError: false,
            isLoading: false,
            locale: DEFAULT_LOCALE,
            type: VisualizationTypes.SCATTER,
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

        const closeEOPMeasure = {
            measure: {
                localIdentifier: "measure2",
                definition: {
                    measureDefinition: {
                        item: {
                            uri: "/gdc/md/projectId/obj/9203",
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
                        localIdentifier: "secondary_measures",
                        items: [closeEOPMeasure],
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

        it.each([[false, true, "measures"], [true, false, "secondary_measures"]])(
            "should render configuration panel with X axis name section is disabled=%s and Y axis name section is disabled=%s",
            (
                expectedXAxisSectionDisabled: boolean,
                expectedYAxisSectionDisabled: boolean,
                measureIdentifier: string,
            ) => {
                const mdObject = {
                    buckets: [
                        {
                            localIdentifier: measureIdentifier,
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
                expect(xAxisSection.props().disabled).toEqual(expectedXAxisSectionDisabled);

                const yAxisSection = axisSections.at(1);
                expect(yAxisSection.props().disabled).toEqual(expectedYAxisSectionDisabled);
            },
        );
    });
});
