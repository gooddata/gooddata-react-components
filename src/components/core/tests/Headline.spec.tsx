import * as React from 'react';
import { mount } from 'enzyme';

import { delay } from '../../tests/utils';
import {
    oneMeasureOneDimensionDataSource
} from '../../tests/mocks';

import { Headline } from '../Headline';
import { ICommonVisualizationProps } from '../base/VisualizationLoadingHOC';
import { HeadlineTransformation } from '@gooddata/indigo-visualizations';
import { IDataSourceProviderInjectedProps } from '../../afm/DataSourceProvider';

describe('Headline', () => {
    function createComponent(props: ICommonVisualizationProps & IDataSourceProviderInjectedProps) {
        return mount<Partial<ICommonVisualizationProps & IDataSourceProviderInjectedProps>>((
            <Headline
                {...props}
                afterRender={jest.fn()}
                drillableItems={[]}
                resultSpec={{
                    dimensions: [
                        { itemIdentifiers: ['measureGroup'] }
                    ]
                }}
            />
        ));
    }

    it('should render HeadlineTransformation and pass down given props and props from execution', () => {
        const wrapper = createComponent({
            dataSource: oneMeasureOneDimensionDataSource
        });

        return delay().then(() => {
            wrapper.update();
            const renderedHeadlineTrans = wrapper.find(HeadlineTransformation);
            const wrapperProps = wrapper.props();
            expect(renderedHeadlineTrans.props()).toMatchObject({
                executionRequest: {
                    afm: wrapperProps.dataSource.getAfm(),
                    resultSpec: wrapperProps.resultSpec
                },
                executionResponse: expect.any(Object),
                executionResult: expect.any(Object),
                onAfterRender: wrapperProps.afterRender,
                drillableItems: wrapperProps.drillableItems
            });
        });
    });
});
