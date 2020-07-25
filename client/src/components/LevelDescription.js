import React from 'react';
import $ from 'jquery';
import BoardView from './BoardView';
import { CELL_SIZE } from '../Karel';
import KarelInterface from '../KarelInterface';
import { Link } from 'react-router-dom';

export default class LevelDescription extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        $.get('/static/levels.json', (levels) => {
            const level = levels.find(level => level.id === Number(this.props.match.params.id));
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
            const karel = new KarelInterface(level)
            beforeRows = karel.initialRows;
            afterRows = karel.finalRows;
            width = CELL_SIZE * this.state.level.boards[0].width
        }


        return (
            <div>
                <h1 className="pageTitle">Level {this.props.match.params.id}: {title}</h1>
                <div className="centeredColumn">
                    <Link className="bigButton" to={`/app/level/${this.props.match.params.id}/`}>Start!</Link>
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
