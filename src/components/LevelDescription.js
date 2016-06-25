import React from 'react';
import $ from 'jquery';
import BoardView from './BoardView';
import { Board } from '../models';
import { Link } from 'react-router';

export default class LevelDescription extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        $.get('/static/levels.json', (levels) => {
            const level = levels.find(level => level.id === Number(this.props.params.id));
            this.setState({level: level});
        });
    }

    render() {
        let title;
        let objective;
        let beforeRows = [[]];
        let afterRows = [[]];

        if (this.state.level) {
            const level = this.state.level;
            title = level.title;
            objective = level.objective;
            beforeRows = Board.fromConfig(level).karel.toJSON();
            afterRows = Board.fromConfig(level, true).karel.toJSON();
        }

        return (
            <div>
                <h1>Level {this.props.params.id}: {title}</h1>
                <h2>Objective</h2>
                <p>{objective}</p>
                <h2>Before and After</h2>
                <div>
                    <div className="exBefore">
                        <BoardView rows={beforeRows}/>
                    </div>
                    <div className="exAfter">
                        <BoardView rows={afterRows}/>
                    </div>
                </div>
                <Link to={`/app/level/${this.props.params.id}/`}>Start!</Link>
            </div>
        );
    }
}
