import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import filterReducer from './reducers';

const store = createStore(filterReducer);

export class FilterProvider extends React.PureComponent<null, null> {
    public render() {
        return (
            <Provider store={store}>
                {this.props.children}
            </Provider>
        );
    }
}
