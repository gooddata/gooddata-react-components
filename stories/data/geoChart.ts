// (C) 2019-2020 GoodData Corporation
import { Execution, VisualizationObject } from "@gooddata/typings";
import { IGeoConfig, IGeoLngLat } from "../../src/interfaces/GeoChart";
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
export const LOCATION_LNGLATS: IGeoLngLat[] = fixtures
    .getLocationAFMData()
    .map(getHeaderItemName)
    .map(getLocation);
export const SEGMENTBY_NUMBERS = fixtures.getSegmentAFMData().map(getHeaderItemName);

export function getExecutionResult(
    isWithLocation = false,
    isWithSegment = false,
    isWithTooltipText = false,
    isWithSize = false,
    isWithColor = false,
    limit: number = 50,
): Execution.IExecutionResult {
    const data = [];
    const metricHeaderItems: Execution.IResultMeasureHeaderItem[] = [];
    const attrHeaderItems: Execution.IResultAttributeHeaderItem[][] = [];

    if (isWithSize) {
        data.push(fixtures.SIZE_AFM_DATA.slice(0, limit));
        metricHeaderItems.push({
            measureHeaderItem: {
                name: "PushPin Value [Size]",
                order: 0,
            },
        });
    }

    if (isWithColor) {
        data.push(fixtures.COLOR_AFM_DATA.slice(0, limit));
        metricHeaderItems.push({
            measureHeaderItem: {
                name: "PushPin Value [Color]",
                order: isWithSize ? 1 : 0,
            },
        });
    }

    if (isWithLocation) {
        attrHeaderItems.push(fixtures.getLocationAFMData().slice(0, limit));
    }

    if (isWithSegment) {
        attrHeaderItems.push(fixtures.getSegmentAFMData().slice(0, limit));
    }

    if (isWithTooltipText) {
        attrHeaderItems.push(fixtures.getTooltipTextAFMData().slice(0, limit));
    }

    const headerItems: Execution.IResultHeaderItem[][][] = [[...attrHeaderItems]];

    if (metricHeaderItems.length) {
        headerItems.unshift([metricHeaderItems]);
    }

    return {
        data,
        paging: {
            count: [2, limit],
            offset: [0, 0],
            total: [2, limit],
        },
        headerItems,
    };
}

const getAttributeHeader = (
    name: string,
    uri: string,
    localIdentifier: string,
): Execution.IAttributeHeader => ({
    attributeHeader: {
        name,
        localIdentifier,
        uri,
        identifier: `label.${name.toLowerCase()}`,
        formOf: {
            name,
            uri: "any-uri",
            identifier: `attr.${name.toLowerCase()}`,
        },
    },
});

const getMeasureHeaderItem = (
    name: string,
    localIdentifier: string,
    uri: string,
): Execution.IMeasureHeaderItem => ({
    measureHeaderItem: {
        name,
        format: "#,##0",
        localIdentifier,
        uri,
        identifier: `measure.${name.toLowerCase()}`,
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
        attributesHeaders.push(getAttributeHeader("State", "/gdc/md/projectId/obj/1", "a_state"));
    }

    if (isWithSegment) {
        attributesHeaders.push(getAttributeHeader("Type", "/gdc/md/projectId/obj/2", "a_type"));
    }

    if (isWithTooltipText) {
        attributesHeaders.push(
            getAttributeHeader("State", "/gdc/md/projectId/obj/3", "a_state_tooltip_text"),
        );
    }

    if (isWithSize) {
        measureHeaderItems.push(
            getMeasureHeaderItem("Population", "m_population", "/gdc/md/projectId/obj/4"),
        );
    }

    if (isWithColor) {
        measureHeaderItems.push(getMeasureHeaderItem("Area", "m_area", "/gdc/md/projectId/obj/5"));
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
            items: [attribute("/gdc/md/projectId/obj/1").localIdentifier("a_state")],
        });
    }

    if (isWithSegment) {
        buckets.push({
            localIdentifier: "segment",
            items: [attribute("/gdc/md/projectId/obj/2").localIdentifier("a_type")],
        });
    }

    if (isWithTooltipText) {
        buckets.push({
            localIdentifier: "toolTipText",
            items: [attribute("/gdc/md/projectId/obj/3").localIdentifier("a_state_tooltip_text")],
        });
    }

    if (isWithSize) {
        buckets.push({
            localIdentifier: "size",
            items: [measure("/gdc/md/projectId/obj/4").localIdentifier("m_population")],
        });
    }

    if (isWithColor) {
        buckets.push({
            localIdentifier: "color",
            items: [measure("/gdc/md/projectId/obj/5").localIdentifier("m_area")],
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
