import * as React from 'react';
import { mount } from 'enzyme';
import { Afm, DataTable, DummyAdapter } from '@gooddata/data-layer';
import { Execute, IExecuteProps } from '../Execute';
import { test } from '@gooddata/js-utils';

const { postpone } = test;

describe('Execute', () => {
    const data = [1, 2, 3];
    const afm: Afm.IAfm = {
        attributes: [
            {
                id: 'slow_execution',
                type: 'attribute'
            }
        ]
    };

    function dataTableFactory() {
        const adapter = new DummyAdapter(data);
        return new DataTable(adapter);
    }

    function createStatelessChild() {
        return jest.fn(props => <span>{JSON.stringify(props.result)}</span>);
    }

    function createComponent(child: Function, props = {}) {
        const defaultProps: IExecuteProps = {
            afm,
            projectId: 'foo',
            onError: jest.fn(),
            onLoadingChanged: jest.fn(),
            dataTableFactory,
            ...props
        };

        return mount(
            <Execute {...defaultProps}>
                {child}
            </Execute>
        );
    }

    it('should pass execution result to its child', (done) => {
        const child = createStatelessChild();
        createComponent(child);

        postpone(() => {
            expect(child).toHaveBeenLastCalledWith({ result: data });
            expect(child).toHaveBeenCalledTimes(1);
        }, done);
    });

    it('should dispatch loading before and after execution', (done) => {
        const onLoadingChanged = jest.fn();
        const child = createStatelessChild();
        createComponent(child, {
            onLoadingChanged
        });

        postpone(() => {
            expect(onLoadingChanged).toHaveBeenCalledTimes(2);
        }, done);
    });

    it('should not dispatch execution for same AFM', (done) => {
        const child = createStatelessChild();
        const wrapper = createComponent(child);

        wrapper.setProps({
            afm
        });

        postpone(() => {
            expect(child).toHaveBeenCalledTimes(1);
        }, done);
    });
});
