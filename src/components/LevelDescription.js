import React from 'react';
import $ from 'jquery';
import BoardView from './BoardView';
import { Board, CELL_SIZE } from '../models';
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
        let width = 0

        if (this.state.level) {
            const level = this.state.level;
            title = level.title;
            objective = level.objective;
            beforeRows = Board.fromConfig(level).karel.toJSON();
            afterRows = Board.fromConfig(level, true).karel.toJSON();
            width = CELL_SIZE * this.state.level.boards[0].width
        }


        return (
            <div>
                <h1 className="pageTitle">Level {this.props.params.id}: {title}</h1>
                <div className="centeredColumn">
                    <Link className="bigButton" to={`/app/level/${this.props.params.id}/`}>Start!</Link>
                    <h2>Objective</h2>
                    <p>{objective}</p>
                </div>
                <div className="exampleHolder">
                    <div className="exBoard">
                        <h2>Before</h2>
                        <BoardView rows={beforeRows} width={width}/>
                    </div>
                    <div className="exBoard">
                        <h2>After</h2>
                        <BoardView rows={afterRows} width={width}/>
                    </div>
                </div>
            </div>
        );
    }
}
