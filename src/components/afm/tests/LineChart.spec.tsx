// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { mount } from 'enzyme';
import { testUtils } from '@gooddata/js-utils';
import { LineChart } from '../LineChart';
import { LineChart as CoreLineChart } from '../../core/LineChart';
import { dummyExecuteAfmAdapterFactory } from './utils/DummyExecuteAfmAdapter';

describe('LineChart', () => {
    const afmWithAttr = {
        attributes: [
            {
                localIdentifier: 'a1',
                displayForm: { uri: 'abc' }
            }
        ]
    };

    it('should provide default resultSpec to core LineChart with attributes', () => {
        const wrapper = mount((
            <LineChart
                projectId="prId"
                afm={afmWithAttr}
                resultSpec={{}}
                adapterFactory={dummyExecuteAfmAdapterFactory}
            />));

        return testUtils.delay().then(() => {
            wrapper.update();
            const dimensions = wrapper.find(CoreLineChart).props().resultSpec.dimensions;
            expect(dimensions).toEqual([ { itemIdentifiers: ['measureGroup'] }, { itemIdentifiers: ['a1'] } ]);
        });
    });

});
