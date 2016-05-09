import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import App from './components/App'
import LevelSelect from './components/LevelSelect'
import Level from './components/Level'

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <Route path="/level-select" component={LevelSelect}/>
            <Route path="/level/:id" component={Level}/>
        </Route>
    </Router>
), document.getElementById('app'));
