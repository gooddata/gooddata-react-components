jest.mock('gooddata');

import * as React from 'react';
import { mount } from 'enzyme';

import { DataTable } from '../../../src/DataTable';
import { Kpi, IKpiProps } from '../../../src/react/wrappers/Kpi';
import { DummyAdapter } from '../../utils/DummyAdapter';

describe('Execute', () => {
    function createComponent(props: IKpiProps) {
        return mount(<Kpi {...props} />);
    }

    it('should format kpi result', (done) => {
        const wrapper = createComponent({
            projectId: 'myprojectid',
            measure: '/gdc/md/myprojectid/obj/123',
            format: '$0,0.00'
        });

        setTimeout(() => {
            try {
                expect(wrapper.find('.gdc-kpi').text()).toEqual('$10,000.00');
                done();
            } catch (error) {
                console.error(error);
            }
        }, 1);
    });
});
