import React from 'react';
import '@gooddata/react-components/styles/css/main.css';
import { Link } from 'react-router-dom';

export const AdvacedUseCases = ({advancedUseCasesRoutes, match: { isExact, path: matchPath }, location: {pathname} }) => {
    return (<div>
        <div className="gd-tabs">
            <Link to={matchPath} className={`gd-tab${pathname === matchPath ? ' is-active' : ''}`}>Overview</Link>
            { advancedUseCasesRoutes.map(({ path, title }) => <Link key={path} to={path} className={`gd-tab${path === pathname ? ' is-active' : ''}`}>{ title }</Link>) }
        </div>
        { isExact ? (<div>
            <h1>Advanced Use Cases</h1>
            <p>Here you can find a list of some more advanced use cases of UI SDK. For example combining multiple components or making existing components more dynamic.</p>
        </div>) : null }
    </div>);
};

export default AdvacedUseCases;
