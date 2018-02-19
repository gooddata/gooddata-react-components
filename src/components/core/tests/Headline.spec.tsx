import * as React from 'react';
import { mount } from 'enzyme';

import { delay } from '../../tests/utils';
import {
    HeadlineTransformation,
    LoadingComponent,
    ErrorComponent,
    oneMeasureDataSource,
    tooLargeDataSource,
    delayedTooLargeDataSource
} from '../../tests/mocks';

jest.mock('@gooddata/indigo-visualizations', () => ({
    HeadlineTransformation
}));

import { Headline } from '../Headline';
import { IBaseVisualizationState, IBaseVisualizationProps } from '../base/BaseVisualization';

import { ErrorStates } from '../../../constants/errorStates';
import { IDrillableItem } from '../../../interfaces/DrillEvents';

describe('Headline', () => {
    const afterRenderMock = jest.fn();
    const drillableItemsMock: IDrillableItem[] = [];

    const createComponent = (props: IBaseVisualizationProps) => {
        return mount<IBaseVisualizationProps, IBaseVisualizationState>(<Headline {...props} />);
    };

    const createProps = (customProps = {}): IBaseVisualizationProps => {
        return {
            dataSource: oneMeasureDataSource,
            afterRender: afterRenderMock,
            drillableItems: drillableItemsMock,
            resultSpec: {},
            ...customProps
        };
    };

    it('should set state.error to OK and call onError callback when sucessfully loaded data', () => {
        const onError = jest.fn();
        const props = createProps({
            onError
        });

        const wrapper = createComponent(props);

        return delay().then(() => {
            expect(wrapper.state().error).toBe(ErrorStates.OK);
            expect(onError).toHaveBeenCalledTimes(1);
            expect(onError).toHaveBeenCalledWith({ status: ErrorStates.OK });
        });
    });

    it('should render HeadlineTransformation and pass down given props and props from execution', () => {
        const props = createProps();

        const wrapper = createComponent(props);

        return delay().then(() => {
            const renderdHeadlineTrans = wrapper.find(HeadlineTransformation);
            expect(renderdHeadlineTrans.props()).toMatchObject({
                executionRequest: {
                    afm: props.dataSource.getAfm(),
                    resultSpec: props.resultSpec
                },
                executionResponse: wrapper.state().result.executionResponse.executionResponse,
                executionResult: wrapper.state().result.executionResult.executionResult,
                onAfterRender: afterRenderMock,
                drillableItems: drillableItemsMock
            });
        });
    });

    it('should call onError with DATA_TOO_LARGE', () => {
        const onError = jest.fn();
        const props = createProps({
            onError,
            dataSource: tooLargeDataSource
        });

        createComponent(props);

        return delay().then(() => {
            expect(onError).toHaveBeenCalledTimes(2);
            expect(onError).toHaveBeenLastCalledWith({
                status: ErrorStates.DATA_TOO_LARGE_TO_COMPUTE,
                options: {
                    dateOptionsDisabled: false
                }
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
            expect(pushData.mock.calls[0][0]).toMatchObject({
                result: {
                    executionResponse: {},
                    executionResult: {}
                },
                options: {
                    dateOptionsDisabled: false
                }
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

    it('should display LoadingComponent during loading and pass props to it', () => {
        const onError = jest.fn();
        let onLoadingChanged;
        const startedLoading = new Promise((resolve) => {
            onLoadingChanged = resolve;
        });
        const dataSource = delayedTooLargeDataSource;
        const props = createProps({
            onError,
            onLoadingChanged,
            dataSource,
            LoadingComponent
        });
        const wrapper = createComponent(props);
        return startedLoading.then(() => {
            expect(wrapper.find(LoadingComponent).length).toBe(1);
            const LoadingElement = wrapper.find(LoadingComponent).get(0);
            expect(LoadingElement.props.props.dataSource).toEqual(dataSource);
        });
    });

    it('should display ErrorComponent on error and pass error and props to it', () => {
        let onError;
        const threwError = new Promise((resolve) => {
            onError = (error: { status: string }) => {
                if (error && error.status !== ErrorStates.OK) {
                    resolve();
                }
            };
        });
        const dataSource = delayedTooLargeDataSource;
        const props = createProps({
            onError,
            dataSource,
            ErrorComponent
        });
        const wrapper = createComponent(props);
        return threwError.then(() => {
            expect(wrapper.find(ErrorComponent).length).toBe(1);
            const ErrorElement = wrapper.find(ErrorComponent).get(0);
            expect(ErrorElement.props.error.status).toBe(ErrorStates.DATA_TOO_LARGE_TO_COMPUTE);
            expect(ErrorElement.props.props.dataSource).toEqual(dataSource);
        });
    });
});
