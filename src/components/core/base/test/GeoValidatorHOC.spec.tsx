// (C) 2020 GoodData Corporation
import * as React from "react";
import { VisualizationObject } from "@gooddata/typings";
import { mount, ReactWrapper } from "enzyme";
import { geoValidatorHOC } from "../GeoValidatorHOC";
import { ErrorComponent } from "../../../simple/ErrorComponent";
import { LOCATION_ITEM, SIZE_ITEM } from "../../../../helpers/tests/geoChart/fixtures";
import { OnError } from "../../../../interfaces/Events";
import { IGeoConfig } from "../../../../interfaces/GeoChart";

interface ITestInnerComponentProps {
    config?: IGeoConfig;
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
            config: {
                mapboxToken: "",
            },
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
                mapboxToken: "",
                mdObject: {
                    buckets,
                    visualizationClass,
                },
            },
            onError,
        });

        expect(wrapper.find(ErrorComponent).exists()).toEqual(true);
        expect(onError).toBeCalledTimes(1);
    });

    it("should not show GEO_LOCATION_MISSING error", () => {
        const buckets: VisualizationObject.IBucket[] = [LOCATION_ITEM, SIZE_ITEM];
        const onError = jest.fn();
        const wrapper = createComponent({
            config: {
                mapboxToken: "",
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
            mapboxToken: "",
            mdObject: {
                buckets,
                visualizationClass,
            },
        };
        const configWithLocation: IGeoConfig = {
            mapboxToken: "",
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
});
