import React from 'react';
import PropTypes from 'prop-types';
import '@gooddata/react-components/styles/css/main.css';
import { Link } from 'react-router-dom';

export const AdvacedUseCases = ({ advancedUseCasesRoutes, match, location: { pathname } }) => {
    return (
        <div className="wrapper">
            {/* language=CSS */}
            <style jsx>{`
                .wrapper {
                    flex: 0;
                    margin-bottom: 20px;
                }
                .text {
                    margin-top: 40px;
                }
            `}</style>
            <div className="gd-tabs">
                <Link to={match.path} className={`gd-tab${pathname === match.path ? ' is-active' : ''}`}>Overview</Link>
                {advancedUseCasesRoutes.map(
                    ({ path, title }) => (
                        <Link key={path} to={path} className={`gd-tab${path === pathname ? ' is-active' : ''}`}>
                            {title}
                        </Link>
                    )
                )}
            </div>
            {match.isExact ? (
                <div className="text" >
                    <h1>Advanced Use Cases</h1>
                    <p>Here you can find a list of some more advanced use cases of UI SDK. For example combining
                        multiple components or making existing components more dynamic.</p>
                </div>
            ) : null}
        </div>
    );
};

AdvacedUseCases.propTypes = {
    advancedUseCasesRoutes: PropTypes.array.isRequired,
    match: PropTypes.shape({
        isExact: PropTypes.bool.isRequired,
        path: PropTypes.string.isRequired
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
    }).isRequired
};

export default AdvacedUseCases;
