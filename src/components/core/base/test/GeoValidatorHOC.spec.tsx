// (C) 2020 GoodData Corporation
import * as React from "react";
import { VisualizationObject } from "@gooddata/typings";
import { mount, ReactWrapper } from "enzyme";
import { geoValidatorHOC } from "../GeoValidatorHOC";
import { ErrorComponent } from "../../../simple/ErrorComponent";
import { LOCATION_ITEM, SIZE_ITEM } from "../../../../helpers/tests/geoChart/data";
import { IGeoConfig } from "../../../../interfaces/GeoChart";

interface ITestInnerComponentProps {
    config?: IGeoConfig;
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
                mapboxAccessToken: "",
            },
            ...customProps,
        };
        const WrappedComponent = geoValidatorHOC(TestInnerComponent);
        return mount(<WrappedComponent {...props} />);
    };

    it("should show GEO_LOCATION_MISSING error", async () => {
        const buckets: VisualizationObject.IBucket[] = [SIZE_ITEM];
        const wrapper = createComponent({
            config: {
                mapboxAccessToken: "",
                mdObject: {
                    buckets,
                    visualizationClass,
                },
            },
        });

        expect(wrapper.find(ErrorComponent).exists()).toEqual(true);
    });

    it("should not show GEO_LOCATION_MISSING error", async () => {
        const buckets: VisualizationObject.IBucket[] = [LOCATION_ITEM, SIZE_ITEM];
        const wrapper = createComponent({
            config: {
                mapboxAccessToken: "",
                mdObject: {
                    buckets,
                    visualizationClass,
                },
            },
        });

        expect(wrapper.find(ErrorComponent).exists()).toEqual(false);
    });
});
