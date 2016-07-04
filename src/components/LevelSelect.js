import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';

// class LevelSelect extends React.Component {
// }

export default React.createClass({
    getInitialState() {
        return { levels: [], progress: [] };
    },
    componentDidMount() {
        $.when(
            $.get('/static/levels.json'),
            $.get('/static/progress.json')
            //$.get('/api/user/progress?token=')
        ).done((d1, d2) => {
            this.setState({ levels: d1[0], progress: d2[0] });
        });
    },
    render() {
        function makeLevel(level) {
            const isCompleted = this.state.progress.indexOf(level.id) !== -1 ? '(completed)': '';
            return <li key={level.id}><Link to={`/app/level-description/${level.id}`}>{`${level.title} ${isCompleted}`}</Link></li>
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
});
