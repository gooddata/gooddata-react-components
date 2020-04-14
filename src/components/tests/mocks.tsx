// (C) 2007-2020 GoodData Corporation
import * as React from "react";

import { IDataSource } from "../../interfaces/DataSource";
import {
    emptyResponse,
    enrichedErrorResponse,
    executionObjectWithTotals,
    locationAfm,
    locationResponse,
    locationSizeColorSegmentAfm,
    locationSizeColorSegmentResponse,
    locationSizeColorSegmentFiltersAfm,
    locationSizeColorSegmentFiltersResponse,
    oneAttributeAfm,
    oneColumnAttributeNoMeasureResponse,
    oneAttributeOneMeasureExecutionObject,
    oneAttributeOneMeasureOneFilterExecutionObject,
    oneAttributesOneMeasureResponse,
    oneMeasureAfm,
    oneMeasureOneDimensionResponse,
    oneMeasureResponse,
    responseWithTotals,
    tooLargeResponse,
    twoMeasuresAfm,
    twoMeasuresOneDimensionResponse,
} from "../../execution/fixtures/ExecuteAfm.fixtures";

export const initChartDataLoading = jest.fn(() =>
    Promise.resolve({
        metadata: {},
        result: {},
    }),
);

export const initTableDataLoading = jest.fn(() =>
    Promise.resolve({
        result: {},
        metadata: {},
        sorting: {},
    }),
);

export class DummyComponent extends React.Component<any, any> {
    public render() {
        return <div />;
    }
}

export class LineFamilyChartTransformation extends DummyComponent {}
export class PieChartTransformation extends DummyComponent {}
export class TableTransformation extends DummyComponent {}
export class HeadlineTransformation extends DummyComponent {}
export class ResponsiveTable extends DummyComponent {}
export class IndigoTable extends DummyComponent {}
export class Visualization extends DummyComponent {}
export class BaseChart extends DummyComponent {}
export class GeoPushpinChart extends DummyComponent {}
export class Table extends DummyComponent {}
export class Xirr extends DummyComponent {}
export class LoadingComponent extends DummyComponent {}
export class ErrorComponent extends DummyComponent {}

export const locationDataSource: IDataSource = {
    getData: () => Promise.resolve(locationResponse),
    getPage: () => Promise.resolve(locationResponse),
    getAfm: () => locationAfm,
    getFingerprint: () => JSON.stringify(locationResponse),
};

export const locationSizeColorSegmentDataSource: IDataSource = {
    getData: () => Promise.resolve(locationSizeColorSegmentResponse),
    getPage: () => Promise.resolve(locationSizeColorSegmentResponse),
    getAfm: () => locationSizeColorSegmentAfm,
    getFingerprint: () => JSON.stringify(locationSizeColorSegmentResponse),
};

export const locationSizeColorSegmentFiltersDataSource: IDataSource = {
    getData: () => Promise.resolve(locationSizeColorSegmentFiltersResponse),
    getPage: () => Promise.resolve(locationSizeColorSegmentFiltersResponse),
    getAfm: () => locationSizeColorSegmentFiltersAfm,
    getFingerprint: () => JSON.stringify(locationSizeColorSegmentFiltersResponse),
};

export const oneMeasureDataSource: IDataSource = {
    getData: () => Promise.resolve(oneMeasureResponse),
    getPage: () => Promise.resolve(oneMeasureResponse),
    getAfm: () => oneMeasureAfm,
    getFingerprint: () => JSON.stringify(oneMeasureResponse),
};

export const oneMeasurePagableOnlyDataSource: IDataSource = {
    getData: () => Promise.resolve(null),
    getPage: () => Promise.resolve(oneMeasureResponse),
    getAfm: () => oneMeasureAfm,
    getFingerprint: () => JSON.stringify(oneMeasureResponse),
};

export const oneMeasureOneDimensionDataSource: IDataSource = {
    getData: () => Promise.resolve(oneMeasureOneDimensionResponse),
    getPage: () => Promise.resolve(oneMeasureOneDimensionResponse),
    getAfm: () => oneMeasureAfm,
    getFingerprint: () => JSON.stringify(oneMeasureOneDimensionResponse),
};

export const twoMeasuresOneDimensionDataSource: IDataSource = {
    getData: () => Promise.resolve(twoMeasuresOneDimensionResponse),
    getPage: () => Promise.resolve(twoMeasuresOneDimensionResponse),
    getAfm: () => twoMeasuresAfm,
    getFingerprint: () => JSON.stringify(twoMeasuresOneDimensionResponse),
};

export const oneAttributeOneMeasureOneFilterDataSource: IDataSource = {
    getData: () => Promise.resolve(oneAttributesOneMeasureResponse),
    getPage: () => Promise.resolve(oneAttributesOneMeasureResponse),
    getAfm: () => oneAttributeOneMeasureOneFilterExecutionObject.execution.afm,
    getFingerprint: () => JSON.stringify(oneAttributesOneMeasureResponse),
};

export const oneColumnAttributeNoMeasure: IDataSource = {
    getData: () => Promise.resolve(oneColumnAttributeNoMeasureResponse),
    getPage: () => Promise.resolve(oneColumnAttributeNoMeasureResponse),
    getAfm: () => oneAttributeAfm,
    getFingerprint: () => JSON.stringify(oneColumnAttributeNoMeasureResponse),
};

export const executionObjectWithTotalsDataSource: IDataSource = {
    getData: () => Promise.resolve(responseWithTotals),
    getPage: () => Promise.resolve(responseWithTotals),
    getAfm: () => executionObjectWithTotals.execution.afm,
    getFingerprint: () => JSON.stringify(responseWithTotals),
};

export const oneAttributeOneMeasureDataSource: IDataSource = {
    getData: () => Promise.resolve(oneAttributesOneMeasureResponse),
    getPage: () => Promise.resolve(oneAttributesOneMeasureResponse),
    getAfm: () => oneAttributeOneMeasureExecutionObject.execution.afm,
    getFingerprint: () => JSON.stringify(oneAttributesOneMeasureResponse),
};

export const emptyDataSource: IDataSource = {
    getData: () => Promise.resolve(emptyResponse),
    getPage: () => Promise.resolve(emptyResponse),
    getAfm: () => ({}),
    getFingerprint: () => JSON.stringify(emptyResponse),
};

export const tooLargeDataSource: IDataSource = {
    getData: () => Promise.reject(tooLargeResponse),
    getPage: () => Promise.reject(tooLargeResponse),
    getAfm: () => ({}),
    getFingerprint: () => JSON.stringify(tooLargeDataSource),
};

export const apiExecutionResponseErrorDataSource: IDataSource = {
    getData: () => Promise.reject(enrichedErrorResponse),
    getPage: () => Promise.reject(enrichedErrorResponse),
    getAfm: () => ({}),
    getFingerprint: () => JSON.stringify(apiExecutionResponseErrorDataSource),
};

export const delayedTooLargeDataSource: IDataSource = {
    getData: () =>
        new Promise((_resolve, reject) => {
            setTimeout(() => {
                reject(tooLargeResponse);
            }, 20);
        }),
    getPage: () =>
        new Promise((_resolve, reject) => {
            setTimeout(() => {
                reject(tooLargeResponse);
            }, 20);
        }),
    getAfm: () => ({}),
    getFingerprint: () => JSON.stringify(tooLargeDataSource),
};
