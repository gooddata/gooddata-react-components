import * as PropTypes from 'prop-types';
import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import filterReducer from './reducers';

export interface IFilterProviderProps {
    filters?: String[];
}

const store = createStore(filterReducer); // TODO will not work with multiple filter providers

export class FilterProvider extends React.PureComponent<IFilterProviderProps, null> {
    static propTypes = {
        filters: PropTypes.arrayOf(PropTypes.string)
    };

    public static defaultProps: Partial<IFilterProviderProps> = {
        filters: []
    };

    public render() {
        // const { filters } = this.props;

        return (
            <Provider store={store}>
                {this.props.children}
            </Provider>
        );
    }
}
