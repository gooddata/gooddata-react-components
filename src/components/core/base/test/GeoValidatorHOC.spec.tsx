// (C) 2020 GoodData Corporation
import * as React from "react";
import { VisualizationObject } from "@gooddata/typings";
import { mount, ReactWrapper } from "enzyme";
import { geoValidatorHOC } from "../GeoValidatorHOC";
import { ErrorComponent } from "../../../simple/ErrorComponent";
import { HeaderPredicateFactory } from "../../../../index";
import {
    LOCATION_ITEM,
    SIZE_ITEM,
    COLOR_ITEM,
    SEGMENT_BY_ITEM,
} from "../../../../helpers/tests/geoChart/fixtures";
import { IDataSource } from "../../../../interfaces/DataSource";
import { IDrillableItem } from "../../../../interfaces/DrillEvents";
import { OnError } from "../../../../interfaces/Events";
import { IGeoConfig } from "../../../../interfaces/GeoChart";
import { IHeaderPredicate } from "../../../../interfaces/HeaderPredicate";
import {
    locationSizeColorSegmentDataSource,
    locationSizeColorSegmentFiltersDataSource,
} from "../../../tests/mocks";

interface ITestInnerComponentProps {
    config?: IGeoConfig;
    dataSource: IDataSource;
    drillableItems?: Array<IDrillableItem | IHeaderPredicate>;
    onError?: OnError;
}
class TestInnerComponent extends React.Component<ITestInnerComponentProps> {
    public render() {
        return <div />;
    }
}

describe("GeoValidatorHOC", () => {
    const visualizationClass = { uri: "abc" };

    const createComponent = (customProps: Partial<ITestInnerComponentProps> = {}): ReactWrapper => {
        const props: ITestInnerComponentProps = {
            dataSource: locationSizeColorSegmentDataSource,
            ...customProps,
        };
        const WrappedComponent = geoValidatorHOC(TestInnerComponent);
        return mount(<WrappedComponent {...props} />);
    };

    it("should show GEO_LOCATION_MISSING error", () => {
        const buckets: VisualizationObject.IBucket[] = [SIZE_ITEM];
        const onError = jest.fn();
        const wrapper = createComponent({
            config: {
                mapboxToken: "mapboxToken",
                mdObject: {
                    buckets,
                    visualizationClass,
                },
            },
            onError,
        });

        expect(wrapper.find(ErrorComponent).exists()).toEqual(true);
        expect(onError).toBeCalledTimes(1);
        expect(wrapper.find(ErrorComponent).props()).toEqual(
            expect.objectContaining({
                code: "GEO_LOCATION_MISSING",
                message: "Sorry, we can't display this insight",
            }),
        );
    });

    it("should show GEO_MAPBOX_TOKEN_MISSING error", () => {
        const onError = jest.fn();
        const wrapper = createComponent({
            config: {
                mapboxToken: "",
            },
            onError,
        });

        expect(wrapper.find(ErrorComponent).exists()).toEqual(true);
        expect(onError).toBeCalledTimes(1);
        expect(wrapper.find(ErrorComponent).props()).toEqual(
            expect.objectContaining({
                description: "The Geochart configuration requires a valid API access token.",
                code: "GEO_MAPBOX_TOKEN_MISSING",
            }),
        );
    });

    it("should not render ErrorComponent", () => {
        const buckets: VisualizationObject.IBucket[] = [LOCATION_ITEM, SIZE_ITEM];
        const onError = jest.fn();
        const wrapper = createComponent({
            config: {
                mapboxToken: "mapboxToken",
                mdObject: {
                    buckets,
                    visualizationClass,
                },
            },
            onError,
        });

        expect(wrapper.find(ErrorComponent).exists()).toEqual(false);
        expect(onError).toBeCalledTimes(0);
    });

    it("should toggle ErrorComponent", () => {
        const buckets: VisualizationObject.IBucket[] = [SIZE_ITEM];
        const bucketsWithLocation: VisualizationObject.IBucket[] = [LOCATION_ITEM, SIZE_ITEM];
        const onError = jest.fn();
        const config: IGeoConfig = {
            mapboxToken: "mapboxToken",
            mdObject: {
                buckets,
                visualizationClass,
            },
        };
        const configWithLocation: IGeoConfig = {
            mapboxToken: "mapboxToken",
            mdObject: {
                buckets: bucketsWithLocation,
                visualizationClass,
            },
        };
        const wrapper = createComponent({ config, onError });
        expect(wrapper.find(ErrorComponent).exists()).toEqual(true);
        expect(onError).toBeCalledTimes(1);

        wrapper.setProps({ config: configWithLocation, onError });
        expect(wrapper.find(ErrorComponent).exists()).toEqual(false);
        expect(onError).toBeCalledTimes(1);

        wrapper.setProps({ config, onError });
        expect(wrapper.find(ErrorComponent).exists()).toEqual(true);
        expect(onError).toBeCalledTimes(2);
    });

    it("should component be updated to new prop when filters changed", () => {
        const config: IGeoConfig = {
            mapboxToken: "mapboxToken",
            mdObject: {
                buckets: [SIZE_ITEM, COLOR_ITEM, LOCATION_ITEM, SEGMENT_BY_ITEM],
                visualizationClass,
            },
        };

        const wrapper = createComponent({ config });
        expect(
            wrapper
                .find(TestInnerComponent)
                .prop("dataSource")
                .getAfm().filters,
        ).toEqual([]);

        wrapper.setProps({ config, dataSource: locationSizeColorSegmentFiltersDataSource });
        expect(
            wrapper
                .find(TestInnerComponent)
                .prop("dataSource")
                .getAfm().filters,
        ).toEqual([
            {
                positiveAttributeFilter: {
                    displayForm: { uri: "/gdc/md/projectId/obj/2" },
                    in: [
                        "/gdc/md/projectId/obj/71/elements?id=7644",
                        "/gdc/md/projectId/obj/71/elements?id=722",
                    ],
                },
            },
            {
                positiveAttributeFilter: {
                    displayForm: { uri: "/gdc/md/projectId/obj/2" },
                    in: ["/gdc/md/projectId/obj/71/elements?id=7644"],
                },
            },
        ]);
    });

    it("should component be updated to new prop when drillableItems changed", () => {
        const config: IGeoConfig = {
            mapboxToken: "mapboxToken",
            mdObject: {
                buckets: [SIZE_ITEM, COLOR_ITEM, LOCATION_ITEM, SEGMENT_BY_ITEM],
                visualizationClass,
            },
        };
        const drillableItems: Array<IDrillableItem | IHeaderPredicate> = [];

        const wrapper = createComponent({
            config,
            drillableItems,
        });
        expect(wrapper.find(TestInnerComponent).prop("drillableItems")).toEqual([]);

        const newDrillableItems: Array<IDrillableItem | IHeaderPredicate> = [
            HeaderPredicateFactory.uriMatch("/abc"),
        ];
        wrapper.setProps({
            config,
            drillableItems: newDrillableItems,
        });
        expect(wrapper.find(TestInnerComponent).prop("drillableItems")).toEqual(newDrillableItems);
    });
});
