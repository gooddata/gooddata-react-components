import * as React from 'react';
import { shallow } from 'enzyme';

import { IAfm } from '../../../src/interfaces/Afm';
import { PieChart } from '../../../src/react/wrappers/PieChart';
import { BaseChart } from '../../../src/react/wrappers/BaseChart';

describe('PieChart', () => {
    function createComponent(props) {
        return shallow(<PieChart {...props} />);
    }

    it('should render pie chart', () => {
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

        expect(wrapper.find(BaseChart).length).toBe(1);
    });
});
