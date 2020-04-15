// (C) 2020 GoodData Corporation
import * as React from "react";
import { mount, ReactWrapper } from "enzyme";
import { testUtils } from "@gooddata/js-utils";
import { VisualizationObject } from "@gooddata/typings";
import { IGeoChartInnerProps, GeoChartInner } from "../geoChart/GeoChartInner";
import { locationDataSource } from "../../tests/mocks";
import { createIntlMock } from "../../visualizations/utils/intlUtils";
import { GeoChart } from "../GeoChart";
import { IGeoConfig } from "../../../interfaces/GeoChart";
import * as BucketNames from "../../../constants/bucketNames";
const intl = createIntlMock();
const mdObject: VisualizationObject.IVisualizationObjectContent = {
    buckets: [
        {
            localIdentifier: BucketNames.LOCATION,
            items: [
                {
                    visualizationAttribute: {
                        localIdentifier: BucketNames.LOCATION,
                        displayForm: {
                            uri: "/gdc/md/projectId/obj/30.df",
                        },
                    },
                },
            ],
        },
    ],
    visualizationClass: {
        uri: "/gdc/md/mockproject/obj/column",
    },
};

describe("GeoChart", () => {
    function renderComponent(
        customProps: Partial<IGeoChartInnerProps> = {},
        customConfig: Partial<IGeoConfig> = {},
    ): ReactWrapper {
        const defaultProps: IGeoChartInnerProps = {
            isLoading: false,
            onDataTooLarge: jest.fn(),
            onNegativeValues: jest.fn(),
            dataSource: locationDataSource,
            chartRenderer: jest.fn(),
            legendRenderer: jest.fn(),
            config: {
                mapboxToken: "mapboxToken",
                mdObject,
                ...customConfig,
            },
            execution: null,
            intl,
        };
        return mount(<GeoChart {...defaultProps} {...customProps} />);
    }

    it("should render given GeoChartOptionsWrapper component", async () => {
        const wrapper = renderComponent();
        await testUtils.delay();
        wrapper.update();
        const geoChartInner = wrapper.find(GeoChartInner);
        expect(geoChartInner.length).toBe(1);
    });
});
