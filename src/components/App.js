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

        let list, logoutNodes
        if (loggedIn) {
            list = (
                <ul className="navList">
                    <li className="navItem"><Link className="navLink" to="/app/level-select">Level Select</Link></li>
                    <li className="navItem"><Link className="navLink" to="/app/reference">Reference</Link></li>
                </ul>
            )
            logoutNodes = (
                <span id="logoutBox">
                    {`Welcome ${this.props.email}`}
                    <Link className="navLink" to='/app' onClick={this.handleLogout}>Logout</Link>
                </span>
            )
        } else {
            list = (
                <ul className="navList">
                    <li className="navItem"><Link className="navLink" to="/app/signup">Signup</Link></li>
                    <li className="navItem"><Link className="navLink" to="/app/login">Login</Link></li>
                </ul>
            )
        }

        return (
            <div>
                <header>
                    <h1 id="logoHeading"><Link to="/app" id="logoText">Mole March</Link></h1>
                    <nav className="nav">
                        {list}
                    </nav>
                    {logoutNodes}
                </header>
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
