import * as React from 'react';
import { shallow } from 'enzyme';

import { IAfm } from '../../../src/interfaces/Afm';
import { ColumnChart } from '../../../src/react/wrappers/ColumnChart';
import { LineFamilyChart } from '../../../src/react/wrappers/LineFamilyChart';

describe('ColumnChart', () => {
    function createComponent(props) {
        return shallow(<ColumnChart {...props} />);
    }

    it('should render column chart', () => {
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
