import * as React from 'react';
import { shallow } from 'enzyme';

import { IAfm } from '../../../src/interfaces/Afm';
import { LineChart } from '../../../src/react/wrappers/LineChart';
import { LineFamilyChart } from '../../../src/react/wrappers/LineFamilyChart';

describe('LineChart', () => {
    function createComponent(props) {
        return shallow(<LineChart {...props} />);
    }

    it('should render line chart', () => {
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
