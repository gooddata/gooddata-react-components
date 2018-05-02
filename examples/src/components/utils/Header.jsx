// (C) 2007-2018 GoodData Corporation
/* eslint-disable react/jsx-closing-tag-location */
import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { NavLink, Link, withRouter } from 'react-router-dom';
import CustomLoading from './CustomLoading';

const favicon = require('../../static/favicon.ico');

const appName = 'GoodData.UI Examples';

class Header extends React.Component {
    renderLoggingBlock = () => {
        const { isUserLoggedIn } = this.props;
        const redirectUri = typeof window !== 'undefined' && !window.location.pathname.match('/login') ? window.location.pathname : '/';
        if (isUserLoggedIn === null) {
            return <div className="gd-header-menu-item" ><CustomLoading color="white" imageHeight={19} /></div>;
        }
        if (isUserLoggedIn === false) {
            return (<div>
                <Link
                    className="gd-header-menu-item"
                    to={{
                        pathname: '/login',
                        state: {
                            redirectUri
                        }
                    }}
                ><span>Login</span></Link>
                <Link
                    className="gd-header-menu-item"
                    to={{
                        pathname: '/registration',
                        state: {
                            redirectUri
                        }
                    }}
                ><span>Register</span></Link>
            </div>);
        }
        return <div className="gd-header-menu-item" onClick={this.props.logoutAction}>Logout</div>;
    }
    render() {
        const { location: { pathname }, mainRoutes, routes } = this.props;
        const href = pathname;
        const currentRoute = (href !== undefined && routes.find(link => (link.path === BASEPATH + href))) || null;
        const pageTitle = currentRoute === null || currentRoute.title === appName
            ? appName
            : `${currentRoute.title} | ${appName}`;

        const navigationElements = mainRoutes.map(({ path, title, exact = false }) => (
            <li key={path}>
                <NavLink to={path} className="gd-header-menu-item" activeClassName="active" exact={exact}>
                    <span>{title}</span>
                </NavLink>
            </li>
        ));

        return (
            <div className="page">
                {/* language=CSS */}
                <style jsx>{`
                    .gd-header {
                        flex: 0;
                    }
                `}</style>
                <Helmet>
                    <title>{pageTitle}</title>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <link rel="shortcut icon" type="image/x-icon" href={favicon} />
                </Helmet>
                <div className="gd-header header-6 is-loaded">
                    <Link to="/" className="gd-header-logo gd-header-measure">
                        <img src="https://secure.gooddata.com/images/header/logo.png" alt={appName} />
                    </Link>
                    <div className="gd-header-stretch gd-header-menu-wrapper">
                        <div className="gd-header-menu gd-header-menu-horizontal">
                            <ul className="gd-header-menu-section gd-header-measure">
                                {navigationElements}
                            </ul>
                        </div>
                    </div>
                    {this.renderLoggingBlock()}
                </div>
            </div>
        );
    }
}

Header.propTypes = {
    location: PropTypes.object.isRequired,
    mainRoutes: PropTypes.array,
    routes: PropTypes.array,
    isUserLoggedIn: PropTypes.bool,
    logoutAction: PropTypes.func.isRequired
};
Header.defaultProps = {
    isUserLoggedIn: null,
    mainRoutes: [],
    routes: []
};

export default withRouter(Header);
