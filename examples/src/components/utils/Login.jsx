// (C) 2007-2018 GoodData Corporation
/* eslint-disable react/jsx-closing-tag-location */
import React from 'react';
import { PropTypes } from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import sdk from '@gooddata/gooddata-js';
import CustomLoading from './CustomLoading';
import CustomError from './CustomError';
import { projectId } from '../../utils/fixtures';

class Login extends React.Component {
    static propTypes = {
        onLogin: PropTypes.func,
        redirectUri: PropTypes.string,
        username: PropTypes.string,
        location: PropTypes.object.isRequired,
        password: PropTypes.string,
        isLoggedIn: PropTypes.bool
    };

    static defaultProps = {
        onLogin: () => {},
        redirectUri: '/',
        username: '',
        password: '',
        isLoggedIn: null
    };

    constructor(props) {
        super(props);

        this.state = {
            username: props.username,
            password: props.password,
            autoLoginAttempted: false,
            isLoggedIn: false,
            isProjectAssigned: null,
            isLoading: false,
            error: null
        };
    }

    componentWillMount() {
        const { location: { state: { username, password } } } = this.props;
        const { autoLoginAttempted } = this.state;
        if (this.props.isLoggedIn) {
            this.checkProjectAvailability(null);
        } else if (username && password && !autoLoginAttempted) {
            this.setState({
                username,
                password,
                autoLoginAttempted: true
            });
            this.login(username, password);
        }
    }

    onUsernameChange = (e) => {
        this.setState({
            username: e.target.value
        });
    }

    onPasswordChange = (e) => {
        this.setState({
            password: e.target.value
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { username, password } = this.state;
        this.login(username, password);
    }

    setErrorCheckingProjectAvailability = (error) => {
        this.setState({
            error: `Could not confirm demo project availability. Examples might not have access to the demo project with id ${projectId}.
            You can try logging out and logging back in. ${error}`,
            isProjectAssigned: null
        });
    }

    checkProjectAvailability = (newProfileUri) => {
        return (
            newProfileUri
                ? Promise.resolve(newProfileUri)
                : sdk.user.getAccountInfo()
                    .then((accountInfo) => {
                        return accountInfo.profileUri;
                    })
        )
            .then((profileUri) => {
                const userId = profileUri.split('/').reverse()[0];
                return sdk.project.getProjects(userId)
                    .then((projects) => {
                        // find project
                        const isProjectAssigned = projects.some((project) => {
                            return project.links.metadata.split('/').reverse()[0] === projectId;
                        });
                        this.setState({
                            error: null,
                            isProjectAssigned
                        });
                        if (!isProjectAssigned) {
                            return sdk.xhr.post('/api/assign-project', {
                                data: {
                                    user: profileUri
                                }
                            })
                                .then(() => {
                                    this.setState({
                                        error: null,
                                        isProjectAssigned: true
                                    });
                                });
                        }
                        return Promise.resolve();
                    });
            })
            .catch((error) => {
                this.setErrorCheckingProjectAvailability(error);
            });
    }

    login = (username, password) => {
        this.setState({
            isLoading: true
        });
        sdk.user.login(username, password)
            .then((userData) => {
                this.setState({
                    isLoggedIn: true,
                    isLoading: false,
                    error: null
                });
                this.props.onLogin(true, null);

                this.checkProjectAvailability(userData.userLogin.profile);
            })
            .catch((error) => {
                this.setState({
                    isLoggedIn: false,
                    isLoading: false,
                    autoLoginAttempted: true,
                    error: `Login error. Probably wrong username and/or password. ${error}`
                });
            });
    }

    renderLogInForm = () => {
        const { username, password, error } = this.state;
        return (
            <div className="Login" >
                {/* language=CSS */}
                <style jsx>{`
                    .Login {
                        max-width: 600px;
                        margin: 20px auto;
                        flex: 1 0 auto;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                `}</style>
                <div style={{ textAlign: 'center' }}>
                    <img src="https://secure.gooddata.com/images/logo-new.png" alt="GoodData" style={{ height: 70 }} />
                </div>
                <form onSubmit={this.onSubmit}>
                    <h1 style={{ textAlign: 'center', padding: 10 }}>Sign in to the GoodData platform</h1>
                    <div className="gd-input" style={{ margin: '5px 0' }}>
                        <label htmlFor="email">e-mail</label>
                        <input className="gd-input-field s-login-input-username" type="email" name="email" value={username} onChange={this.onUsernameChange} />
                    </div>
                    <div className="gd-input" style={{ margin: '5px 0' }}>
                        <label htmlFor="password">password</label>
                        <input className="gd-input-field s-login-input-password" type="password" name="password" value={password} onChange={this.onPasswordChange} />
                    </div>
                    {error && <CustomError message={error} />}
                    <div className="gd-input" style={{ margin: '5px 0', textAlign: 'center' }}>
                        <button type="submit" className="button button-primary button-important submit-button s-login-submit">Sign in</button>
                    </div>
                </form>
            </div>
        );
    }

    render() {
        const { isLoading, isProjectAssigned, error } = this.state;
        const isLoggedIn = this.state.isLoggedIn || this.props.isLoggedIn;
        const verticalCenterStyle = {
            flex: '1 0 auto',
            display: 'flex',
            maxWidth: '600px',
            margin: '0 auto',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'stretch'
        };
        if (isLoggedIn) {
            if (error) {
                return <div style={verticalCenterStyle} ><CustomError message={error} /></div>;
            }
            if (isProjectAssigned) {
                return <Redirect to={this.props.redirectUri} />;
            }
            if (isProjectAssigned === false) {
                return <div style={verticalCenterStyle} ><CustomLoading height={null} label="Assigning demo project&hellip;" /></div>;
            }
            return <div style={verticalCenterStyle} ><CustomLoading height={null} label="Checking demo availability&hellip;" /></div>;
        }
        if (isLoading) {
            return <div style={verticalCenterStyle} ><CustomLoading height={null} label="Logging in&hellip;" /></div>;
        }
        return this.renderLogInForm();
    }
}


export default withRouter(Login);
