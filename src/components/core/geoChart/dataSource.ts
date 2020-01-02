// (C) 2007-2019 GoodData Corporation
import { AFM, Execution } from "@gooddata/typings";
import { IGetPage } from "../base/VisualizationLoadingHOC";

const DEFAULT_COLOR_VALUE = 20;
const DEFAULT_SIZE_VALUE = 20;

type IGeoDataSourceFeature = GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;
export type IGeoDataSourceFeatures = IGeoDataSourceFeature[];

export interface IGeoDataSource {
    features: IGeoDataSourceFeatures;
    colorMax: number;
    colorMin: number;
    sizeMax: number;
    sizeMin: number;
}

function transformData(execution: any): IGeoDataSource {
    const {
        executionResult: { data },
    } = execution;

    let colorMax: number = 0;
    let colorMin: number = 0;
    let sizeMax: number = 0;
    let sizeMin: number = 0;

    const features = data.map(
        (dataItem: any): IGeoDataSourceFeature => {
            const colorValue = parseFloat(dataItem[0]) || DEFAULT_COLOR_VALUE;
            colorMax = Math.max(colorMax, colorValue);
            colorMin = Math.min(colorMin, colorValue);

            const sizeValue = parseFloat(dataItem[1]) || DEFAULT_SIZE_VALUE;
            sizeMax = Math.max(sizeMax, sizeValue);
            sizeMin = Math.min(sizeMin, sizeValue);

            return {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [],
                },
                properties: {
                    City: "",
                    pushpinValue: sizeValue,
                },
            };
        },
    );

    return {
        features,
        colorMax,
        colorMin,
        sizeMax,
        sizeMin,
    };
}

export const createDataSource = (resultSpec: AFM.IResultSpec, getPage: IGetPage) => {
    // TODO: 100 is for testing only, will be fixed in SD-779
    const pagePromise = getPage(
        resultSpec,
        // column limit defaults to SERVERSIDE_COLUMN_LIMIT (1000), because 1000 columns is hopefully enough.
        [100, undefined], // [endRow - startRow, undefined],
        // column offset defaults to 0, because we do not support horizontal paging yet
        [0, undefined], // [startRow, undefined],
    );
    return pagePromise.then((execution: Execution.IExecutionResponses | null) => {
        if (!execution) {
            return null;
        }
        return transformData(execution);
    });
};
