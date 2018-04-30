// (C) 2007-2018 GoodData Corporation
/* eslint-disable react/jsx-closing-tag-location */
import React from 'react';
import ReactDOM from 'react-dom';
import sdk from '@gooddata/gooddata-js';

import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom';


import '@gooddata/goodstrap/lib/theme-indigo.scss';
import Header from './components/utils/Header';
import { CustomError } from './components/utils/CustomError';
import CustomLoading from './components/utils/CustomLoading';

import { routes, userRoutes, mainRoutes } from './routes/_list';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: null,
            isLoadingUserState: true,
            errorMessage: null
        };
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        this.isUserLoggedIn();
    }

    onUserLogin = (isLoggedIn, errorMessage) => {
        this.setState({
            isLoggedIn,
            isLoadingUserState: false
        });

        if (errorMessage) {
            this.setState({ errorMessage: errorMessage.message });
        }
    }

    isUserLoggedIn = () => {
        this.setState({
            isLoadingUserState: true
        });
        return sdk.user.isLoggedIn()
            .then((isLoggedIn) => {
                return this.onUserLogin(isLoggedIn, null);
            })
            .catch((errorMessage) => {
                return this.onUserLogin(false, errorMessage);
            });
    }

    logout() {
        this.setState({
            isLoadingUserState: true
        });
        sdk.user.logout().then(() => {
            this.setState({
                isLoggedIn: false,
                isLoadingUserState: false
            });
        }).catch(() => {
            this.setState({
                isLoadingUserState: false
            });
        });
    }

    renderContent = () => {
        const { isLoggedIn, isLoadingUserState } = this.state;
        if (isLoadingUserState) {
            return (
                <CustomLoading height="100%" />
            );
        }
        return (<div style={{}}>
            <Switch>
                {userRoutes.map(({ title, path, Component, redirectTo, ...routeProps }) => (<Route
                    key={path}
                    path={path}
                    component={() => <Component isLoggedIn={isLoggedIn} />}
                    {...routeProps}
                />))}
                {isLoggedIn === false && <Route component={() => (
                    <Redirect to={{
                        pathname: '/login',
                        state: {
                            redirectUriAfterLogin: '/'
                        }
                    }}
                    />
                )}
                />}
            </Switch>
            {
                routes.map(({ title, path, Component, redirectTo, ...routeProps }) => (
                    <Route
                        key={path}
                        path={path}
                        component={Component}
                        {...routeProps}
                    />))
            }
        </div>
        );
    }

    render() {
        const { isLoggedIn, errorMessage } = this.state;
        return (
            <Router basename={BASEPATH}>
                <div className="main-wrapper">
                    {/* language=CSS */}
                    <style jsx>{`
                        :global(html),
                        :global(body),
                        :global(.root) {
                            height: 100%;
                        }

                        :global(hr.separator) {
                            border: 1px solid #EEE;
                            border-width: 1px 0 0 0;
                            margin: 20px 0;
                        }

                        :global(.main-wrapper) {
                            display: flex;
                            height: 100%;
                            flex-direction: column;
                            justify-content: flex-start;
                            align-items: stretch;
                        }

                        main {
                            flex: 1;
                            overflow: auto;
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-start;
                            align-items: stretch;
                            padding: 20px;
                            flex: 1 0 auto;
                        }
                    `}</style>
                    <Header
                        mainRoutes={mainRoutes}
                        routes={routes}
                        isUserLoggedIn={isLoggedIn}
                        logoutAction={this.logout}
                    />
                    {errorMessage
                        ? <CustomError error={{ status: '403', message: errorMessage }} />
                        : null
                    }
                    <main>
                        {this.renderContent()}
                    </main>
                </div>
            </Router>
        );
    }
}

const root = document.createElement('div');
root.className = 'root';
document.body.appendChild(root);
ReactDOM.render(<App />, root);
