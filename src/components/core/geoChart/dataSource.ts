// (C) 2007-2019 GoodData Corporation
import { AFM, Execution } from "@gooddata/typings";
import { IGetPage } from "../base/VisualizationLoadingHOC";

type IGeoDataSourceFeature = GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;
export type IGeoDataSourceFeatures = IGeoDataSourceFeature[];

function transformData(execution: Execution.IExecutionResponses): IGeoDataSourceFeatures {
    const {
        executionResult: { data, headerItems },
    } = execution;

    const features = headerItems[0][0].map(
        (header: Execution.IResultHeaderItem, index: number): IGeoDataSourceFeature => {
            const cityName = Execution.isAttributeHeaderItem(header) ? header.attributeHeaderItem.name : "";
            return {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [-86.6807365, 32.6010112],
                },
                properties: {
                    State: "AL",
                    City: cityName,
                    value: parseFloat(data[index][0]),
                },
            };
        },
    );

    return features;
}

export const createDataSource = (resultSpec: AFM.IResultSpec, getPage: IGetPage) => {
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
