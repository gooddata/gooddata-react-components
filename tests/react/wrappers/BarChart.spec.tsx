import * as React from 'react';
import { shallow } from 'enzyme';

import { IAfm } from '../../../src/interfaces/Afm';
import { BarChart } from '../../../src/react/wrappers/BarChart';
import { LineFamilyChart } from '../../../src/react/wrappers/LineFamilyChart';

describe('BarChart', () => {
    function createComponent(props) {
        return shallow(<BarChart {...props} />);
    }

    it('should render bar chart', () => {
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
            afm
        });

        expect(wrapper.find(LineFamilyChart).length).toBe(1);
    });
});
