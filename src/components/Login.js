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
                this.props.history.push('/level-select')
            })
            .fail((err) => {
                this.props.dispatch(fetchUserFailed())
            });
    }

    render() {
        return (
            <div>
                <h1>Login</h1>
                <form method="post" action="/api/authenticate" onSubmit={this.handleFormSubmit}>
                    <div>
                        <input type="email" placeholder="email" ref={(ref) => this.emailInput = ref}/>
                    </div>
                    <div>
                        <input type="password" placeholder="password" ref={(ref) => this.passwordInput = ref}/>
                    </div>
                    <div>
                        <input type="submit" value="go"/>
                    </div>
                </form>
            </div>
        );
    }
}

export default connect()(Login)
