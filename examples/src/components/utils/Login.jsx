// (C) 2007-2018 GoodData Corporation
/* eslint-disable react/jsx-closing-tag-location */
import React from 'react';
import { PropTypes } from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import sdk from '@gooddata/gooddata-js';
import CustomLoading from './CustomLoading';
import CustomError from './CustomError';

class Login extends React.Component {
    static propTypes = {
        onLogin: PropTypes.func,
        redirectUri: PropTypes.string,
        username: PropTypes.string,
        location: PropTypes.object.isRequired,
        password: PropTypes.string,
        isLoggedIn: PropTypes.bool
    }

    static defaultProps = {
        onLogin: () => {},
        redirectUri: '/',
        username: '',
        password: '',
        isLoggedIn: null
    }

    constructor(props) {
        super(props);

        this.state = {
            username: props.username,
            password: props.password,
            autoLoginAttempted: false,
            isLoggedIn: false,
            isLoading: false,
            error: null
        };
    }

    componentWillMount() {
        const { location: { state: { username, password } } } = this.props;
        const { autoLoginAttempted } = this.state;
        console.log('this.props.location', this.props.location);
        console.log('autoLoginAttempted', autoLoginAttempted);
        console.log('username', username);
        console.log('password', password);
        if (username && password && !autoLoginAttempted) {
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

    login = (username, password) => {
        this.setState({
            isLoading: true
        });
        sdk.user.login(username, password)
            .then(() => {
                this.setState({
                    isLoggedIn: true,
                    isLoading: false,
                    error: null
                });
                this.props.onLogin(true, null);
                if (typeof window !== 'undefined') {
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.log('login error', error);
                this.setState({
                    isLoggedIn: false,
                    isLoading: false,
                    autoLoginAttempted: true,
                    error: 'Wrong username and/or password'
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
                    <h1 style={{ textAlign: 'center', padding: 10 }}>Sign in to GoodData platform</h1>
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

    renderError = () => {
        return (
            <div className="gd-message" style={{ display: 'block', margin: '5px 0' }}>{this.state.error}</div>
        );
    }

    render() {
        const { isLoading, isLoggedIn } = this.state;
        console.log('this.props.isLoggedIn', this.props.isLoggedIn);
        if (isLoading) {
            return (<div
                style={{
                    flex: '1 0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'stretch'
                }}
            >
                <CustomLoading height={null} />
            </div>);
        }
        if (isLoggedIn || this.props.isLoggedIn) {
            return <Redirect to={this.props.redirectUri} />;
        }
        return this.renderLogInForm();
    }
}


export default withRouter(Login);
