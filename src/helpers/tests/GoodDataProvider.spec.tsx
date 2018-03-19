import * as React from 'react';
import * as PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { GoodDataProvider } from '../GoodDataProvider';

describe('GooddDataProvider', () => {
    class DummyChild extends React.Component {
        public static contextTypes = {
            gooddata: PropTypes.object
        };

        public render(): JSX.Element {
            return (<h1>I'm testing child component</h1>);
        }
    }

    it('should inject gooddata sdk into the react tree components', () => {
        const wrapper = mount(
            <GoodDataProvider>
                <DummyChild />
            </GoodDataProvider>
        );

        expect(
            wrapper.find(DummyChild).instance().context
        ).toHaveProperty('gooddata');
    });
});
