import React from 'react';
import $ from 'jquery';
import { fetchUserRequest, fetchUserSuccess, fetchUserFailed } from '../actions'
import { connect } from 'react-redux'

class Login extends React.Component {
    constructor() {
        super();
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const data = {email: this.emailInput.value, password: this.passwordInput.value};
        this.props.dispatch(fetchUserRequest())

        $.post(e.target.action, data)
            .done((data) => {
                this.props.dispatch(fetchUserSuccess(this.emailInput.value, data.token))
                this.props.history.push('/app/level-select')
            })
            .fail((err) => {
                this.props.dispatch(fetchUserFailed())
            });
    }

    render() {
        return (
            <div className="centeredColumn">
                <h1 className="pageTitle">Login</h1>
                <div className="postBoxContainer">
                    <div className="postBox">
                        <form method="post" action="/api/authenticate" onSubmit={this.handleFormSubmit}>
                            <div className="inputHolder">
                                <input className="credentialInput" size="30" type="email" placeholder="email" ref={(ref) => this.emailInput = ref}/>
                            </div>
                            <div className="inputHolder">
                                <input className="credentialInput" size="30" type="password" placeholder="password" ref={(ref) => this.passwordInput = ref}/>
                            </div>
                            <div>
                                <input className="credentialInput" type="submit" value="Log In"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(Login)
