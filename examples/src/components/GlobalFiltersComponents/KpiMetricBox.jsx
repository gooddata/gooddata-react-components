import * as React from 'react';
import PropTypes from 'prop-types';

export const KpiMetricBox = ({title, children}) => {
    return (
        <div className="kpi-metric">
            { /*language=CSS*/ }
            <style jsx>{`
                    .kpi-metric {
                        min-width: 200px;
                        text-align: center;
                        display: inline-block;
                        border: 2px solid #14b2e2;
                        padding: 10px 0 0 0;
                        border-radius: 5px;
                        margin: 10px;
                    }

                    .kpi-metric .value {
                        font-size: 2rem;
                        font-weight: bold;
                        text-align: center;
                        padding: 10px;
                        min-height: 2rem;
                    }

                    .kpi-metric .title {
                        font-size: 1.1rem;
                        text-align: center;
                        margin: 0 15px;
                    }

                    .kpi-metric .title span {
                        border-radius: 5px;
                        background-color: #14b2e2;
                        padding: 5px 20px;
                        color: #ffffff;
                    }
                `}</style>
            <div className="value">
                {children}
            </div>
            <div className="title">
                <span>{title}</span>
            </div>
        </div>
    )
}

KpiMetricBox.propTypes = {
    title: PropTypes.string.isRequired
}