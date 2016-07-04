import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import $ from 'jquery'

import { fetchProgressAllLevelsSuccess } from '../actions'

class LevelSelect extends React.Component {
    constructor() {
        super()
        this.state = { levels: [], progress: [] }
    }

    componentDidMount() {
        $.get('/static/levels.json', (data) => {
            this.setState({ levels: data })
        })

        $.get(`/api/user/progress?token=${this.props.token}`, (data) => {
            this.props.dispatch(fetchProgressAllLevelsSuccess(data.progress))
        })
    }

    render() {
        if (!this.props.progress || !this.state.levels) {
            return null
        }

        function makeLevel(level) {
            const levelProgress = this.props.progress[level.id] || {}
            const completedNotification = levelProgress.completed ? ' (completed)': ''
            return <li key={level.id}><Link to={`/app/level-description/${level.id}`}>{`${level.title}${completedNotification}`}</Link></li>
        }
        const levels = this.state.levels.map(makeLevel.bind(this));

        return (
            <div className="centeredColumn generalText">
                <h1 className="pageTitle">LevelSelect</h1>
                <ol>
                    {levels}
                </ol>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.user.token,
        progress: state.levelStatus
    }
}

export default connect(mapStateToProps)(LevelSelect)
