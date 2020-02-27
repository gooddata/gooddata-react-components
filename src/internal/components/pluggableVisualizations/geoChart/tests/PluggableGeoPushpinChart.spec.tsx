// (C) 2019-2020 GoodData Corporation
import noop = require("lodash/noop");
import * as referencePointMocks from "../../../../mocks/referencePointMocks";
import * as uiConfigMocks from "../../../../mocks/uiConfigMocks";
import { PluggableGeoPushpinChart } from "../PluggableGeoPushpinChart";
import { IExtendedReferencePoint, IVisConstruct } from "../../../../interfaces/Visualization";

describe("PluggableGeoPushpinChart", () => {
    const defaultProps: IVisConstruct = {
        projectId: "PROJECTID",
        element: "body",
        configPanelElement: null as string,
        callbacks: {
            afterRender: noop,
            pushData: noop,
        },
    };

    function createComponent(props: IVisConstruct = defaultProps) {
        return new PluggableGeoPushpinChart(props);
    }

    it("should create geo pushpin visualization", () => {
        const visualization = createComponent();

        expect(visualization).toBeTruthy();
    });

    describe("getExtendedReferencePoint", () => {
        const geoPushpin = createComponent();
        const sourceReferencePoint = referencePointMocks.simpleGeoPushpinReferencePoint;
        const extendedReferencePointPromise: Promise<
            IExtendedReferencePoint
        > = geoPushpin.getExtendedReferencePoint(sourceReferencePoint);

        it("should return a new reference point with geoPushpin adapted buckets", () => {
            return extendedReferencePointPromise.then(extendedReferencePoint => {
                expect(extendedReferencePoint.buckets).toEqual(sourceReferencePoint.buckets);
            });
        });

        it("should return a new reference point with geoPushpin UI config", () => {
            return extendedReferencePointPromise.then(extendedReferencePoint => {
                expect(extendedReferencePoint.uiConfig).toEqual(uiConfigMocks.defaultGeoPushpinUiConfig);
            });
        });
    });
});
