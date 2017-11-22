import * as React from 'react';
import { mount } from 'enzyme';

import { delay } from '../../tests/utils';

import {
    TableTransformation,
    ResponsiveTable
} from '../../tests/mocks';

// Replace this with optional prop
jest.mock('@gooddata/indigo-visualizations', () => ({
    TableTransformation,
    ResponsiveTable
}));

import { IDataSource } from '../../../interfaces/DataSource';
import { Table, ITableProps } from '../Table';
import { ErrorStates } from '../../../constants/errorStates';
import { oneMeasureResponse, tooLargeResponse } from '../../../execution/fixtures/ExecuteAfm.fixtures';

const oneMeasureDataSource: IDataSource = {
    getData: () => Promise.resolve(oneMeasureResponse),
    getAfm: () => ({}),
    getFingerprint: () => JSON.stringify(oneMeasureResponse)
};

const tooLargeDataSource: IDataSource = {
    getData: () => Promise.reject(tooLargeResponse),
    getAfm: () => ({}),
    getFingerprint: () => JSON.stringify(tooLargeDataSource)
};

describe('Table', () => {
    const createComponent = (props: ITableProps) => {
        return mount<ITableProps>(<Table {...props} />);
    };

    const createProps = (customProps = {}): ITableProps => {
        return {
            height: 200,
            environment: 'dashboards',
            dataSource: oneMeasureDataSource,
            ...customProps
        };
    };

    it('should call initDataLoading when sorting changed', () => {
        // TODO
        const props = createProps({
            resultSpec: {}
        });
        const wrapper = createComponent(props);

        const newProps = createProps({
            visualizationProperties: { sortItems: 'abc' },
            transformation: {}
        });
        wrapper.setProps(newProps);

        return delay().then(() => {
            expect(wrapper.find(TableTransformation).length).toBe(1);
        });
    });

    it('should not call initDataLoading second time', () => {
        const onError = jest.fn();
        const props = createProps({
            onError,
            dataSource: oneMeasureDataSource
        });
        const wrapper = createComponent(props);
        wrapper.setProps({
            dataSource: oneMeasureDataSource
        });

        return delay().then(() => {
            expect(wrapper.find('.gdc-indigo-responsive-table')).toBeDefined();
            expect(wrapper.find(TableTransformation).length).toBe(1);
            expect(onError).toHaveBeenCalledTimes(1);
            expect(onError).toHaveBeenCalledWith({ status: ErrorStates.OK });
        });
    });

    it('should render responsive table', () => {
        const onError = jest.fn();
        const props = createProps({
            onError,
            environment: 'dashboards'
        });
        const wrapper = createComponent(props);

        return delay().then(() => {
            expect(wrapper.find('.gdc-indigo-responsive-table')).toBeDefined();
            expect(wrapper.find(TableTransformation).length).toBe(1);
            expect(wrapper.find(TableTransformation).prop('tableRenderer')).toBeDefined();
            expect(onError).toHaveBeenCalledTimes(1);
            expect(onError).toHaveBeenCalledWith({ status: ErrorStates.OK });
        });
    });

    it('should not render responsive table when result is not available', () => {
        const props = createProps();
        const wrapper = createComponent(props);

        return delay().then(() => {
            expect(wrapper.find(TableTransformation).length).toBe(1);
            wrapper.setState({ result: null }, () => {
                expect(wrapper.find(TableTransformation).length).toBe(0);
            });
        });
    });

    it('should not render responsive table when table is still loading', () => {
        const props = createProps();
        const wrapper = createComponent(props);

        return delay().then(() => {
            expect(wrapper.find(TableTransformation).length).toBe(1);
            wrapper.setState({ isLoading: true }, () => {
                expect(wrapper.find(TableTransformation).length).toBe(0);
            });
        });
    });

    it('should not render responsive table when error is set', () => {
        const props = createProps();
        const wrapper = createComponent(props);

        return delay().then(() => {
            expect(wrapper.find(TableTransformation).length).toBe(1);
            wrapper.setState({ error: ErrorStates.UNKNOWN_ERROR }, () => {
                expect(wrapper.find(TableTransformation).length).toBe(0);
            });
        });
    });

    it('should call onError with DATA_TOO_LARGE', () => {
        const onError = jest.fn();
        const props = createProps({
            onError,
            dataSource: tooLargeDataSource
        });
        const wrapper = createComponent(props);

        return delay().then(() => {
            expect(wrapper.find(TableTransformation).length).toBe(0);
            expect(onError).toHaveBeenCalledTimes(2);
            expect(onError).toHaveBeenLastCalledWith({
                status: ErrorStates.DATA_TOO_LARGE_TO_COMPUTE,
                options: expect.any(Object)
            });
        });
    });

    it('should call pushData with execution result', () => {
        const pushData = jest.fn();
        const props = createProps({
            pushData
        });
        createComponent(props);

        return delay().then(() => {
            expect(pushData).toHaveBeenCalledWith({
                result: oneMeasureResponse,
                options: {
                    dateOptionsDisabled: false
                },
            });
        });
    });

    it('should trigger `onLoadingChanged`', () => {
        const loadingHandler = jest.fn();

        const props = createProps({
            onLoadingChanged: loadingHandler
        });

        createComponent(props);

        return delay().then(() => {
            expect(loadingHandler).toHaveBeenCalledTimes(2);
        });
    });
});
