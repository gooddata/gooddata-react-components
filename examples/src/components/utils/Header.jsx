// (C) 2007-2018 GoodData Corporation
/* eslint-disable react/jsx-closing-tag-location */
import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { NavLink, Link, withRouter } from 'react-router-dom';
import CustomLoading from './CustomLoading';
import { projectId, backendUrlForInfo } from '../../utils/fixtures';

const favicon = require('../../static/favicon.ico');
const logo = require('../../static/gooddata.svg');

const appName = 'GoodData.UI Examples';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayBackendInfo: true
        };
    }

    toggleBackendInfo = () => {
        const { displayBackendInfo } = this.state;
        this.setState({ displayBackendInfo: !displayBackendInfo });
    }

    renderBackendInfo = () => {
        const { isUserLoggedIn } = this.props;
        const { displayBackendInfo } = this.state;

        if (!isUserLoggedIn || !displayBackendInfo) {
            return null;
        }

        return (
            <div className="backendInfo">
                <span className="backendInfoItem">
                    Connected to:
                    <span className="backendInfoValue">{backendUrlForInfo}</span>
                </span>
                <span className="backendInfoItem">
                    Project ID:
                    <span className="backendInfoValue">{projectId}</span>
                </span>
                <span className="backendInfoClose" onClick={this.toggleBackendInfo} />
            </div>
        );
    }

    renderLoggingBlock = () => {
        const { isUserLoggedIn } = this.props;
        const redirectUri = typeof window !== 'undefined' && !window.location.pathname.match('/login') ? window.location.pathname : '/';
        if (isUserLoggedIn === null) {
            return <div className="gd-header-menu-item" ><CustomLoading color="white" imageHeight={19} /></div>;
        }
        if (isUserLoggedIn === false) {
            return (<div>
                <Link
                    className="gd-header-menu-item button-login button-header"
                    to={{
                        pathname: '/login',
                        state: {
                            redirectUri
                        }
                    }}
                ><span>Login</span></Link>
            </div>);
        }
        return <div className="gd-header-menu-item button-logout button-header" onClick={this.props.logoutAction}>Logout</div>;
    }

    render() {
        const { location: { pathname }, topNavigationRoutes, routes } = this.props;
        const href = pathname;
        const currentRoute = (href !== undefined && routes.find(link => (link.path === BASEPATH + href))) || null;
        const pageTitle = currentRoute === null || currentRoute.title === appName
            ? appName
            : `${currentRoute.title} | ${appName}`;

        const navigationElements = topNavigationRoutes.map(({ path, title, exact = false }) => (
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
                    .page {
                        width: 100%;
                        text-align: center;
                    }

                    .gd-header {
                        position: fixed;
                        top: 0;
                        right: 0;
                        left: 0;
                        /* Table component scrollbar has 99 */
                        z-index: 100;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        height: 64px;
                        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
                        color: rgba(0, 0, 0, 0.7);
                        background: #fdfdfd;
                    }

                    .gd-header-inner {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        width: 100%;
                        height: 100%;
                        max-width: 1400px;
                    }

                    .gd-header-logo-img {
                        max-height: none;
                    }

                    .gd-header-inner :global(.gd-header-logo) {
                        margin-right: 0;
                        opacity: 0.9;
                    }

                    .gd-header-inner :global(.gd-header-logo:hover),
                    .gd-header-inner :global(.gd-header-logo:focus),
                    .gd-header-inner :global(.gd-header-logo:active) {
                        opacity: 1;
                    }

                    .gd-header-menu-section {
                        padding: 0 20px;
                    }

                    .gd-header-inner :global(.gd-header-menu-item) {
                        height: 62px;
                        margin: 0;
                        padding: 0 22px;
                        border-bottom: 2px solid transparent;
                        color: rgba(0, 0, 0, 0.7);
                        font-size: 15px;
                        line-height: 62px;
                        transition: all 0.2s;
                    }

                    @media screen and (min-width: 1025px) {
                        .gd-header-inner :global(.gd-header-menu-item) {
                            margin: 0 23px;
                        }
                    }

                    .gd-header-inner :global(.gd-header-menu-item:hover),
                    .gd-header-inner :global(.gd-header-menu-item:focus),
                    .gd-header-inner :global(.gd-header-menu-item:active) {
                        border-color: #464e56;
                        color: rgba(0, 0, 0, 0.9);
                    }

                    .gd-header-inner :global(.gd-header-menu-item.active) {
                        color: rgba(0, 0, 0, 0.9);
                        border-color: #14b2e2;
                        font-weight: normal;
                    }

                    .gd-header-inner :global(.button-header) {
                        height: 28px;
                        margin: 0 0 0 20px;
                        padding: 0 10px;
                        border: none;
                        color: rgba(0, 0, 0, 0.7);
                        font-size: 12px;
                        line-height: 28px;
                    }

                    .gd-header-inner :global(.button-header-border) {
                        padding: 0 22px;
                        border: 1px solid rgba(0, 0, 0, 0.5);
                        border-radius: 100px;
                        line-height: 26px;
                    }

                    .gd-header-inner :global(.button-header:hover),
                    .gd-header-inner :global(.button-header:focus),
                    .gd-header-inner :global(.button-header:active) {
                        color: rgba(0, 0, 0, 0.9);
                        border-color: rgba(0, 0, 0, 0.9);
                    }

                    .page :global(.backendInfo) {
                        position: relative;
                        display: inline-block;
                        max-width: 1400px;
                        margin: 40px 20px 20px;
                        padding: 15px 60px 15px 30px;
                        border-radius: 50px;
                        color: #94a1ad;
                        font-size: 13px;
                        text-align: center;
                        background: #f0f0f0;
                    }

                    .page :global(.backendInfoItem) {
                        display: inline-block;
                        margin-left: 20px;
                        padding-left: 20px;
                        border-left: 1px solid #94a1ad;
                    }

                    .page :global(.backendInfoItem:first-child) {
                        border-left: none;
                        margin: 0;
                        padding: 0;
                    }

                    .page :global(.backendInfoValue) {
                        display: inline-block;
                        margin-left: 4px;
                        color: #333;
                    }

                    .page :global(.backendInfoClose) {
                        position: absolute;
                        top: 50%;
                        right: 20px;
                        width: 20px;
                        height: 20px;
                        margin-top: -10px;
                        color: #94a1ad;
                        cursor: pointer;
                        transition: color 0.2s;
                    }

                    .page :global(.backendInfoClose:hover),
                    .page :global(.backendInfoClose:focus),
                    .page :global(.backendInfoClose:active) {
                        color: #000;
                    }

                    .page :global(.backendInfoClose::before),
                    .page :global(.backendInfoClose::after) {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 0;
                        width: 20px;
                        height: 0;
                        border-bottom: 1px solid currentColor;
                    }

                    .page :global(.backendInfoClose::before) {
                        transform: rotate(45deg);
                    }

                    .page :global(.backendInfoClose::after) {
                        transform: rotate(-45deg);
                    }
                `}</style>
                <Helmet>
                    <title>{pageTitle}</title>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <link rel="shortcut icon" type="image/x-icon" href={favicon} />
                </Helmet>
                <div className="gd-header header-6 is-loaded">
                    <div className="gd-header-inner">
                        <a href="https://sdk.gooddata.com/gooddata-ui/" className="gd-header-logo gd-header-measure">
                            <img src={logo} alt={appName} className="gd-header-logo-img" />
                        </a>
                        <div className="gd-header-stretch gd-header-menu-wrapper">
                            <div className="gd-header-menu gd-header-menu-horizontal">
                                <ul className="gd-header-menu-section gd-header-measure">
                                    <li>
                                        <a href="https://sdk.gooddata.com/gooddata-ui/docs/about_gooddataui.html" className="gd-header-menu-item">Docs</a>
                                    </li>
                                    <li>
                                        <a href="https://sdk.gooddata.com/gooddata-ui/docs/support_options.html" className="gd-header-menu-item">Support</a>
                                    </li>
                                    {navigationElements}
                                </ul>
                            </div>
                        </div>
                        <a
                            href="https://github.com/gooddata/gooddata-react-components#run-live-examples-locally"
                            className="gd-header-menu-item button-header button-header-border"
                            target="_blank"
                            rel="noopener noreferrer"
                        >Run Locally</a>
                        {this.renderLoggingBlock()}
                    </div>
                </div>
                {this.renderBackendInfo()}
            </div>
        );
    }
}

Header.propTypes = {
    location: PropTypes.object.isRequired,
    topNavigationRoutes: PropTypes.array,
    routes: PropTypes.array,
    isUserLoggedIn: PropTypes.bool,
    logoutAction: PropTypes.func.isRequired
};
Header.defaultProps = {
    isUserLoggedIn: null,
    topNavigationRoutes: [],
    routes: []
};

export default withRouter(Header);
