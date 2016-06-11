import React from 'react';
import $ from 'jquery';

export default class Signup extends React.Component {
    constructor() {
        super();
        this.state = {};

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleFormSubmit(e) {
        e.preventDefault();
        console.log(this.state);

        if (this.state.password.length < 8) {
            this.setState({message: 'Password must be at least 8 characters long'});
            return;
        } else if (this.state.password !== this.state.passwordAgain) {
            this.setState({message: 'Passwords do not match'});
            return;
        } else {
            this.setState({message: ''});
        }

        const data = {email: this.state.email, password: this.state.password};
        $.post(e.target.action, data)
            .done((data) => {
            })
            .fail((err) => {
                this.setState({message: err.responseJSON.msg});
            });
    }

    handleInputChange(e) {
        e.preventDefault();
        const state = {};
        state[e.target.name] = e.target.value;
        this.setState(state);
    }

    render() {
        return (
            <div>
                <h1>Signup</h1>
                <form method="post" action="/api/users" onSubmit={this.handleFormSubmit}>
                    <div>{this.state.message}</div>
                    <div>
                        <input type="email" name="email" placeholder="email" onChange={this.handleInputChange}/>
                    </div>
                    <div>
                        <input type="password" name="password" placeholder="password" onChange={this.handleInputChange}/>
                    </div>
                    <div>
                        <input type="password" name="passwordAgain" placeholder="password (again)" onChange={this.handleInputChange}/>
                    </div>
                    <div>
                        <input type="submit" value="go"/>
                    </div>
                </form>
            </div>
        );
    }
}
