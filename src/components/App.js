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

        return (
            <div>
                <header>
                    <h1 id="logoHeading"><Link to="/app" id="logoText">Mole March</Link></h1>
                    { loggedIn && <nav className="nav">
                        <ul className="navList">
                            <li className="navItem"><Link className="navLink" to="/app/level-select">Level Select</Link></li>
                            <li className="navItem"><Link className="navLink" to="/app/reference">Reference</Link></li>
                        </ul>
                    </nav> }
                    <nav className="nav rightNav">
                        <span id="loginMessage">{loggedIn ? `${this.props.email}` : null}</span>
                        { loggedIn ? (
                            <ul className="navList">
                                <li className="navItem"><a className="navLink" href='#' onClick={this.handleLogout}>Logout</a></li>
                            </ul>
                        ) : (
                            <ul className="navList">
                                <li className="navItem"><Link className="navLink" to="/app/login">Login</Link></li>
                                <li className="navItem"><Link className="navLink" to="/app/signup">Signup</Link></li>
                            </ul>
                        )}
                    </nav>
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
