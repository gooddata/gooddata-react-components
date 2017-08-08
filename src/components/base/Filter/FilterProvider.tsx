import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import filterReducer from './reducers';

export interface IFilterProviderProps {
    filters?: String[];
}

const store = createStore(filterReducer); // TODO will not work with multiple filter providers

export class FilterProvider extends React.PureComponent<null, null> {
    public render() {
        return (
            <Provider store={store}>
                {this.props.children}
            </Provider>
        );
    }
}
