import * as React from 'react';
import { mount } from 'enzyme';

import { delay } from '../../tests/utils';
import {
    oneMeasureOneDimensionDataSource
} from '../../tests/mocks';

import { Headline } from '../Headline';
import { ICommonVisualizationProps } from '../base/VisualizationLoadingHOC';
import { HeadlineTransformation } from '@gooddata/indigo-visualizations';

describe('Headline', () => {
    const createComponent = (props: ICommonVisualizationProps) => {
        return mount<Partial<ICommonVisualizationProps>>((
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
    };

    it('should render HeadlineTransformation and pass down given props and props from execution', () => {
        const wrapper = createComponent({
            dataSource: oneMeasureOneDimensionDataSource
        });

        return delay().then(() => {
            wrapper.update();
            const renderdHeadlineTrans = wrapper.find(HeadlineTransformation);
            const wrapperProps = wrapper.props();
            expect(renderdHeadlineTrans.props()).toMatchObject({
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
