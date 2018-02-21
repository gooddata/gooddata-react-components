import * as React from 'react';
import PropTypes from 'prop-types';

export const EmployeeCard = ({avatarUrl, name, startDate, gender}) => {
    return (
        <div className="employee-card">
            { /*language=CSS*/ }
            <style jsx>{`
                .rounded-avatar {
                    object-fit: cover;
                    border-radius:50%;
                    width: 100px;
                    height: 100px;
                    border: 4px solid #14b2e2;
                }

                .employee-card {
                    padding: 20px;
                    width: 100%;
                    clear: both;
                }

                .avatar-wrapper {
                    display: inline-block;
                    padding: 10px;
                }

                .additional-info {
                    display: inline-block;
                }

                .info-row {
                    width: 100%;
                    flex: 1;
                }

                .info-title {
                    font-size: 1.3rem;
                    font-weight: bold;
                    display: inline-block;
                    padding: 0 10px 10px 0;
                }

                .info-text {
                    display: inline-block;
                    font-size: 1.2rem;
                }
            `}</style>
            <div className="avatar-wrapper">
                <img className="rounded-avatar" src={avatarUrl} alt={name} />
            </div>
            <div className="additional-info">
                <h1>{name}</h1>
                <div className="info-row">
                    <div className="info-title">
                        Employed from:
                    </div>
                    <div className="info-text">
                        {startDate}
                    </div>
                </div>
                <div className="info-row">
                    <div className="info-title">
                        Position:
                    </div>
                    <div className="info-text">
                        {gender === 'M' ? 'waiter': 'waitress'}
                    </div>
                </div>
            </div>
        </div>
    );
}

EmployeeCard.propTypes = {
    avatarUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired
}