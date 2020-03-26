// (C) 2020 GoodData Corporation
import * as referencePointMock from "../../../mocks/referencePointMocks";
import { getBulletChartUiConfig } from "../bulletChartUiConfigHelper";
import { createInternalIntl } from "../../internalIntlProvider";
import { DEFAULT_BULLET_CHART_CONFIG } from "../../../constants/uiConfig";
import { VisualizationTypes } from "../../../../constants/visualizationTypes";
import { DEFAULT_LOCALE } from "../../../../constants/localization";

describe("bulletChartUiConfigHelper", () => {
    describe("getBulletChartUiConfig", () => {
        const intl = createInternalIntl(DEFAULT_LOCALE);
        const refPointMock = {
            ...referencePointMock.threeMeasuresBucketsReferencePoint,
            uiConfig: DEFAULT_BULLET_CHART_CONFIG,
        };

        it("should return bullet chart ui config", () => {
            const bulletChartUiConfig = getBulletChartUiConfig(refPointMock, intl, VisualizationTypes.BULLET);
            expect(bulletChartUiConfig).toMatchSnapshot();
        });
    });
});
