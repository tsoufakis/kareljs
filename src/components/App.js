import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import { logout } from '../actions'

class App extends React.Component {
    constructor() {
        super()
        this.handleLogout = this.handleLogout.bind(this)
    }

    handleLogout(e) {
        e.preventDefault()
        this.props.dispatch(logout())
    }

    render() {
        const loggedIn = !!this.props.email
        let loginLinks
        if (loggedIn) {
            loginLinks = [
                <li key="0"><a href='#' onClick={this.handleLogout}>Logout</a></li>
            ]
        } else {
            loginLinks = [
                <li key="0"><Link to="/app/login">Login</Link></li>,
                <li key="1"><Link to="/app/signup">Signup</Link></li>
            ]
        }

        return (
            <div>
                <Link to="/app"><h1>Mole March</h1></Link>
                { loggedIn ?  <div>{`logged in as ${this.props.email}`}</div> : null }
                <ul>
                    {loginLinks}
                    <li><Link to="/app/level-select">Level Select</Link></li>
                    <li><Link to="/app/reference">Reference</Link></li>
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
