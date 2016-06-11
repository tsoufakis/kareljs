import React from 'react';
import $ from 'jquery';

export default class Login extends React.Component {
    constructor() {
        super();

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleFormSubmit(e) {
        e.preventDefault();
        console.log(e.target);
        console.log(this.state);
        const data = {email: this.state.email, password: this.state.password};
        $.post(e.target.action, data)
            .done((data) => {
            })
            .fail((err) => {
            });
    }

    handleEmailChange(e) {
        this.setState({email: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    render() {
        return (
            <div>
                <h1>Login</h1>
                <form method="post" action="/api/authenticate" onSubmit={this.handleFormSubmit}>
                    <div>
                        <input type="email" placeholder="email" onChange={this.handleEmailChange}/>
                    </div>
                    <div>
                        <input type="password" placeholder="password" onChange={this.handlePasswordChange}/>
                    </div>
                    <div>
                        <input type="submit" value="go"/>
                    </div>
                </form>
            </div>
        );
    }
}
