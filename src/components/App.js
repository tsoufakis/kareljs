import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';

class App extends React.Component {
    render() {
        return (
            <div>
                <h1>Mole March</h1>
                <div>{this.props.email ? `logged in as ${this.props.email}` : ''}</div>
                <ul>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Signup</Link></li>
                    <li><Link to="/level-select">Select Level</Link></li>
                </ul>
                {this.props.children}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        email: state.user.email
    }
}

export default connect(mapStateToProps)(App)
