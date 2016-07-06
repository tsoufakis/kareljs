import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { signupFormMessage, createUserRequest, createUserSuccess, createUserFailed } from '../actions'

class Signup extends React.Component {
    constructor() {
        super();
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleFormSubmit(e) {
        e.preventDefault()

        const email = this.emailInput.value
        const password = this.passwordInput.value
        const passwordAgain = this.passwordAgainInput.value
        const dispatch = this.props.dispatch

        if (password.length < 8) {
            dispatch(signupFormMessage('Password must be at least 8 characters long'))
            return;
        } else if (password !== passwordAgain) {
            dispatch(signupFormMessage('Passwords do not match'))
            return;
        } else {
            dispatch(signupFormMessage(''))
        }

        const data = { email, password };
        dispatch(createUserRequest())
        $.post(e.target.action, data)
            .done((data) => {
                dispatch(createUserSuccess(email, data.token))
                this.props.history.push('/app/level-select')
            })
            .fail((err) => {
                dispatch(signupFormMessage(err.responseJSON.msg))
                dispatch(createUserFailed())
            });
    }

    render() {
        return (
            <div className="centeredColumn">
                <h1 className="pageTitle">Signup</h1>
                <div className="postBoxContainer">
                    <div className="postBox">
                        <form method="post" action="/api/users" onSubmit={this.handleFormSubmit}>
                            <div>{this.props.message}</div>
                            <div className="inputHolder">
                                <input className="credentialInput" type="email" placeholder="email" ref={(ref) => this.emailInput = ref}/>
                            </div>
                            <div className="inputHolder">
                                <input className="credentialInput" type="password" placeholder="password" ref={(ref) => this.passwordInput = ref}/>
                            </div>
                            <div className="inputHolder">
                                <input className="credentialInput" type="password" placeholder="password (again)" ref={(ref) => this.passwordAgainInput = ref}/>
                            </div>
                            <div>
                                <input className="credentialInput" type="submit" value="Sign Up"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        message: state.signupForm.message
    }
}

export default connect(mapStateToProps)(Signup)
