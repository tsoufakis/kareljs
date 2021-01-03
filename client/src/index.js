import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route} from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import es6Promise from 'es6-promise'

import App from './components/App'
import moleMarch from './reducers'


if (process.env.NODE_ENV !== 'production') {
    console.log('You\'re in development mode');
}

es6Promise.polyfill()

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

const store = createStore(moleMarch, initialState, applyMiddleware(thunkMiddleware, logger))

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
        <Router>
            <Route path="/" component={App} />
        </Router>
    </Provider>
), document.getElementById('app'));
