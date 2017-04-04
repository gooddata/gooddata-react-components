import * as React from 'react';
import { mount } from 'enzyme';

import { DataTable } from '../../../src/DataTable';
import { Execute } from '../../../src/react/execution/Execute';
import { DummyAdapter } from '../../utils/DummyAdapter';

describe('Execute', () => {
    const data = [1, 2, 3];
    const afm = {
        attributes: [
            {
                id: '/attr/uri'
            }
        ]
    };

    function dataTableFactory() {
        const adapter = new DummyAdapter(data);
        return new DataTable(adapter);
    }

    function createComponent(props = {}) {
        const defaultProps = {
            afm,
            projectId: 'foo',
            onExecute: jest.fn(),
            onError: jest.fn(),
            onLoading: jest.fn(),
            ...props
        };
        return mount(<Execute {...defaultProps} />);
    }

    it('should dispatch execution after mount', (done) => {
        const onExecute = jest.fn();
        const wrapper = createComponent({
            dataTableFactory,
            onExecute
        });

        setTimeout(() => {
            expect(onExecute).toBeCalled();
            done();
        }, 0);
    });

    it('should dispatch loading before and after execution', (done) => {
        const onLoading = jest.fn();

        const wrapper = createComponent({
            dataTableFactory,
            onLoading
        });

        setTimeout(() => {
            expect(onLoading).toHaveBeenCalledTimes(2);
            done();
        }, 0);
    });

    it('should not dispatch execution for same AFM', (done) => {
        const onExecute = jest.fn();
        const wrapper = createComponent({
            dataTableFactory,
            onExecute
        });

        wrapper.setProps({
            afm
        });

        setTimeout(() => {
            expect(onExecute).toHaveBeenCalledTimes(1);
            done();
        }, 0);
    });
});
