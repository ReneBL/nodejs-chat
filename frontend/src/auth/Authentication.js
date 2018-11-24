import React from 'react';
import LoginForm from '../login/LoginForm';
import RegisterForm from '../register/RegisterForm';
import { Link } from "react-router-dom";
import { login } from '../util/AuthManager';
import './Authentication.css';

class Authentication extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            surname: '',
            nickname: '',
            pass: '',
            authState: {
                failed: false,
                message: 'An error has ocurred.'
            }
        }
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSurnameChange = this.handleSurnameChange.bind(this);
        this.handleNicknameChange = this.handleNicknameChange.bind(this);
        this.handlePassChange = this.handlePassChange.bind(this);
        this.onSubmitClicked = this.onSubmitClicked.bind(this);
    }
    handleNicknameChange(e) {
        this.setState({
            nickname: e.target.value
        })
    }

    handlePassChange(e) {
        this.setState({
            pass: e.target.value
        })
    }

    handleNameChange(e) {
        this.setState({
            name: e.target.value
        })
    }

    handleSurnameChange(e) {
        this.setState({
            surname: e.target.value
        })
    }

    onSubmitClicked(e) {
        e.preventDefault();

        const isLogin = this.props.location.pathname === '/login';
        const conf = {
            endpoint: isLogin ? '/api/users/login' : '/api/users/register',
            payload: isLogin ? JSON.stringify({
                'nickname': this.state.nickname,
                'pass': this.state.pass
            }) : JSON.stringify({
                'nickname': this.state.nickname,
                'pass': this.state.pass,
                'name': this.state.name,
                'surname': this.state.surname
            })
        }
        fetch(conf.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: conf.payload
        }).then(resp => {
            if (resp.ok && resp.headers.has('Access-Token')) {
                const token = resp.headers.get('Access-Token');
                login(token);
                this.props.history.push("/");
            } else {
                return resp.json();
            }
        }).then(resp => {
            this.setState({
                authState: {
                    failed: true,
                    message: (resp.message) ? resp.message : "An error has ocurred"
                }
            });
        }).catch(err => {
            this.setState({
                authState: {
                    failed: true,
                    message: "An error has ocurred. Please try again later."
                }
            });
            console.log(err);
        });
    }

    render() {
        const loc = this.props.location.pathname;
        return (
            <div className="Authentication">
                <div className={this.state.authState.failed ? "Authentication-fail-banner" : "Authentication-fail-banner-hidden"}>
                    <span>{this.state.authState.message}</span>
                </div>
                <div className="Authentication-content">
                    <h2 className="Authentication-header">NodeChat</h2>
                    {loc === "/login" ? (
                        <div>
                            <LoginForm handleNicknameChange={this.handleNicknameChange}
                                handlePassChange={this.handlePassChange} onSubmitClicked={this.onSubmitClicked} />
                            <span className="Authentication-registrationtext">No tienes cuenta? <Link to={"/register"}>Registrate</Link></span>
                        </div>
                    ) : (
                            <RegisterForm handleNicknameChange={this.handleNicknameChange}
                                handlePassChange={this.handlePassChange} handleNameChange={this.handleNameChange}
                                handleSurnameChange={this.handleSurnameChange} onSubmitClicked={this.onSubmitClicked} />
                        )
                    }
                </div>
            </div>
        );
    }

}

export default Authentication;