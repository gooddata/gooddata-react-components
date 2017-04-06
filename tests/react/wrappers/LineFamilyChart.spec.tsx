jest.mock('gooddata');

import * as React from 'react';
import { mount } from 'enzyme';

import { IAfm } from '../../../src/interfaces/Afm';
import { LineFamilyChart, ILineFamilyChartProps } from '../../../src/react/wrappers/LineFamilyChart';
import LineFamilyChartTransformation from '@gooddata/indigo-visualizations/lib/Chart/LineFamilyChartTransformation';

describe('LineChart', () => {
    function createComponent(props: ILineFamilyChartProps) {
        return mount(<LineFamilyChart {...props} />);
    }

    it('should render line chart', (done) => {
        const afm: IAfm = {
            measures: [
                {
                    id: '1',
                    definition: {
                        baseObject: {
                            id: '/gd/md/m1'
                        }
                    }
                }
            ]
        };
        const wrapper = createComponent({
            projectId: 'myprojectid',
            afm,
            transformation: {},
            type: 'line'
        });

        setTimeout(() => {
            try {
                expect(wrapper.find('.gdc-line-chart')).toBeDefined();
                expect(wrapper.find(LineFamilyChartTransformation).length).toBe(1);
                done();
            } catch (error) {
                console.error(error);
            }
        }, 1);
    });
});
