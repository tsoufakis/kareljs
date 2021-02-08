import React from 'react';
import { connect } from 'react-redux'
import { Link, Route } from 'react-router-dom';

import { logout, refreshToken } from '../actions'

import LevelSelect from './LevelSelect'
import Level from './Level'
import LevelDescription from './LevelDescription'
import Login from './Login'
import Signup from './Signup'
import Reference from './Reference'
import Home from './Home'

function requireAuth(nextState, replace) {
    console.log('hi', nextState, replace)
}

class App extends React.Component {
    constructor() {
        super()
        this.handleLogout = this.handleLogout.bind(this)
    }

    componentDidMount() {
        this.props.dispatch(refreshToken())
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
                    <Link className="navLink" to="/" onClick={this.handleLogout}>Logout</Link>
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
                    <h1 id="logoHeading"><Link to="/" id="logoText">KarelJS</Link></h1>
                    <nav className="nav">
                        {list}
                    </nav>
                    {logoutNodes}
                </header>
                <div id="main">
                    <Route exact path="/" component={Home}/>
                    <Route path="/app/login" component={Login}/>
                    <Route path="/app/signup" component={Signup}/>
                    <Route path="/app/level-select" component={LevelSelect} onEnter={requireAuth}/>
                    <Route path="/app/level-description/:id" component={LevelDescription}/>
                    <Route path="/app/level/:id" component={Level}/>
                    <Route path="/app/reference" component={Reference}/>
                </div>
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
