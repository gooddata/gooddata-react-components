// (C) 2019-2020 GoodData Corporation
import { Execution, VisualizationObject } from "@gooddata/typings";
import { IGeoConfig, IGeoLngLatLike } from "../../src/interfaces/GeoChart";
import { measure, attribute } from "../../src/helpers/model";
import { stringToFloat } from "../../src/helpers/utils";
import { getHeaderItemName } from "../../src/helpers/executionResultHelper";
import { getLocation } from "../../src/helpers/geoChart/data";
// tslint:disable-next-line: no-var-requires
const fixtures = require("./geoChart/fixtures");

interface IGeoOptions {
    isWithLocation?: boolean;
    isWithSegment?: boolean;
    isWithTooltipText?: boolean;
    isWithSize?: boolean;
    isWithColor?: boolean;
}

export const SIZE_NUMBERS: number[] = fixtures.SIZE_AFM_DATA.map(stringToFloat);
export const COLOR_NUMBERS: number[] = fixtures.COLOR_AFM_DATA.map(stringToFloat);
export const LOCATION_LNGLATS: IGeoLngLatLike[] = fixtures
    .getLocationAFMData()
    .map(getHeaderItemName)
    .map(getLocation);

export function getExecutionResult(
    isWithLocation = false,
    isWithSegment = false,
    isWithTooltipText = false,
    isWithSize = false,
    isWithColor = false,
): Execution.IExecutionResult {
    const data = [];
    const metricHeaderItems: Execution.IResultMeasureHeaderItem[] = [];
    const attrHeaderItems: Execution.IResultAttributeHeaderItem[][] = [];

    if (isWithSize) {
        data.push(fixtures.SIZE_AFM_DATA);
        metricHeaderItems.push({
            measureHeaderItem: {
                name: "PushPin Value [Size]",
                order: 0,
            },
        });
    }

    if (isWithColor) {
        data.push(fixtures.COLOR_AFM_DATA);
        metricHeaderItems.push({
            measureHeaderItem: {
                name: "PushPin Value [Color]",
                order: isWithSize ? 1 : 0,
            },
        });
    }

    if (isWithLocation) {
        attrHeaderItems.push(fixtures.getLocationAFMData());
    }

    if (isWithSegment) {
        attrHeaderItems.push(fixtures.getSegmentAFMData());
    }

    if (isWithTooltipText) {
        attrHeaderItems.push(fixtures.getTooltipTextAFMData());
    }

    const headerItems: Execution.IResultHeaderItem[][][] = [[...attrHeaderItems]];

    if (metricHeaderItems.length) {
        headerItems.unshift([metricHeaderItems]);
    }

    return {
        data,
        paging: {
            count: [2, 50],
            offset: [0, 0],
            total: [2, 50],
        },
        headerItems,
    };
}

const getAttributeHeader = (name: string, uri: string): Execution.IAttributeHeader => ({
    attributeHeader: {
        name,
        localIdentifier: `a_${name}`,
        uri,
        identifier: `label.${name}`,
        formOf: {
            name,
            uri: "any-uri",
            identifier: `attr.${name}`,
        },
    },
});

const getMeasureHeaderItem = (name: string, localIdentifier: string): Execution.IMeasureHeaderItem => ({
    measureHeaderItem: {
        name,
        format: "#,##0",
        localIdentifier,
        identifier: `measure.${name}`,
    },
});

export function getExecutionResponse(
    isWithLocation = false,
    isWithSegment = false,
    isWithTooltipText = false,
    isWithSize = false,
    isWithColor = false,
): Execution.IExecutionResponse {
    const attributesHeaders: Execution.IAttributeHeader[] = [];
    const measureHeaderItems: Execution.IMeasureHeaderItem[] = [];
    const resultDimensions: Execution.IResultDimension[] = [];

    if (isWithLocation) {
        attributesHeaders.push(getAttributeHeader("State", "/gdc/md/projectId/obj/1"));
    }

    if (isWithSegment) {
        attributesHeaders.push(getAttributeHeader("Type", "/gdc/md/projectId/obj/2"));
    }

    if (isWithTooltipText) {
        attributesHeaders.push(getAttributeHeader("State", "/gdc/md/projectId/obj/3"));
    }

    if (isWithSize) {
        measureHeaderItems.push(getMeasureHeaderItem("Population", "m_size"));
    }

    if (isWithColor) {
        measureHeaderItems.push(getMeasureHeaderItem("Area", "m_color"));
    }

    if (measureHeaderItems.length) {
        resultDimensions.push({
            headers: [
                {
                    measureGroupHeader: {
                        items: measureHeaderItems,
                    },
                },
            ],
        });
    }

    if (attributesHeaders.length) {
        resultDimensions.push({
            headers: attributesHeaders,
        });
    } else {
        resultDimensions.push({
            headers: [],
        });
    }

    return {
        links: {
            executionResult: "any_result",
        },
        dimensions: resultDimensions,
    };
}

export function getGeoConfig(props: IGeoOptions): IGeoConfig {
    const buckets: VisualizationObject.IBucket[] = [];
    const { isWithLocation, isWithSegment, isWithTooltipText, isWithSize, isWithColor } = props;
    if (isWithLocation) {
        buckets.push({
            localIdentifier: "location",
            items: [attribute("/gdc/md/projectId/obj/1").localIdentifier("location")],
        });
    }

    if (isWithSegment) {
        buckets.push({
            localIdentifier: "segment",
            items: [attribute("/gdc/md/projectId/obj/2").localIdentifier("segment")],
        });
    }

    if (isWithTooltipText) {
        buckets.push({
            localIdentifier: "toolTipText",
            items: [attribute("/gdc/md/projectId/obj/3").localIdentifier("tooltipText")],
        });
    }

    if (isWithSize) {
        buckets.push({
            localIdentifier: "size",
            items: [measure("/gdc/md/projectId/obj/4").localIdentifier("m_size")],
        });
    }

    if (isWithColor) {
        buckets.push({
            localIdentifier: "color",
            items: [measure("/gdc/md/projectId/obj/5").localIdentifier("m_color")],
        });
    }
    const mdObject: VisualizationObject.IVisualizationObjectContent = {
        visualizationClass: {
            uri: "local:pushpin",
        },
        buckets,
    };
    const config: IGeoConfig = {
        mdObject,
        mapboxToken: "",
    };
    return config;
}
