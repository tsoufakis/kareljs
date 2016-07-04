import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, hashHistory, browserHistory, IndexRoute } from 'react-router'
import App from './components/App'
import LevelSelect from './components/LevelSelect'
import Level from './components/Level'
import LevelDescription from './components/LevelDescription'
import Login from './components/Login'
import Signup from './components/Signup'
import { Provider } from 'react-redux'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import moleMarch from './reducers'
import Reference from './components/Reference'

const logger = createLogger()

let initialState = {}

if (localStorage.email) {
    if (localStorage.email) {
        Object.assign(initialState, { user: {
            email: localStorage.email,
            token: localStorage.token
        }})
    }
}

const store = createStore(moleMarch, initialState, applyMiddleware(logger))

// probably a security vulnerability
const unsubscribe = store.subscribe(() => {
    const state = store.getState()
    if (state.user.email) {
        localStorage.email = state.user.email
        localStorage.token = state.user.token
    } else {
        localStorage.removeItem('email')
        localStorage.removeItem('token')
    }
})

ReactDOM.render((
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <Route path="/app/login" component={Login}/>
                <Route path="/app/signup" component={Signup}/>
                <Route path="/app/level-select" component={LevelSelect}/>
                <Route path="/app/level-description/:id" component={LevelDescription}/>
                <Route path="/app/level/:id" component={Level}/>
                <Route path="/app/reference" component={Reference}/>
            </Route>
        </Router>
    </Provider>
), document.getElementById('app'));
