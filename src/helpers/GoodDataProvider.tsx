import * as React from 'react';
import * as PropTypes from 'prop-types';
import { factory, ISdkOptions, ISdk } from 'gooddata';

export interface IGoodDataProviderProps {
    domain?: string;
    children: React.ReactNode;
}

export interface IGoodDataProviderContext {
    gooddata: ISdk;
}

/**
 * Adds gooddata-js (https://github.com/gooddata/gooddata-js) to the React context
 * so the gooddata-js can be used from anywhere withing the component tree.
 *
 * Automatically, this gooddata-js instance will be used by all GoodData components by default.
 *
 * The intention behind this is to provide a single place where you can setup the gooddata-js
 * e.g. custom domain name, polling delays etc.
 *
 * Usage:
 *
 * File ./src/App.jsx
 *
 * ReactDOM.render(
 *  <GoodDataProvider domain="https://secure.gooddata.com">
 *      <App />
 *  </GoodDataProvider>,
 *  document.getElementById('app-root')
 * );
 */
export class GoodDataProvider extends React.Component<IGoodDataProviderProps> {
    public static propTypes = {
        domain: PropTypes.string,
        children: PropTypes.node
    };

    public static childContextTypes = {
        gooddata: PropTypes.object
    };

    public getChildContext(): IGoodDataProviderContext {
        return {
            gooddata: factory(this.getGoodDataOptions())
        };
    }

    public render() {
        return this.props.children;
    }

    private getGoodDataOptions(): ISdkOptions {
        return {
            domain: this.props.domain
        };
    }
}
