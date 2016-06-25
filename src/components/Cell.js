import React from 'react';
import { Compass } from '../models'
import CellObject from './CellObject'

const BEARING_TO_CLASS_NAME = {};
BEARING_TO_CLASS_NAME[Compass.NORTH] = 'wallNorth';
BEARING_TO_CLASS_NAME[Compass.EAST]  = 'wallEast';
BEARING_TO_CLASS_NAME[Compass.SOUTH] = 'wallSouth';
BEARING_TO_CLASS_NAME[Compass.WEST]  = 'wallWest';

export default class Cell extends React.Component {
    render() {
        const cell = this.props.cell;
        const children = [];
        let classes = ['cell'];

        classes = classes.concat(cell.walls.map(function(bearing) {
            return BEARING_TO_CLASS_NAME[bearing]; 
        }));

        if (cell.beepers > 0) {
            children.push(<CellObject key={1} src="/static/beeper.png" cellSize={this.props.size}/>)
        }

        if (cell.karel) {
            children.push(<CellObject key={2} src={`/static/karel${cell.karelBearing}.png`} cellSize={this.props.size}/>)
        }

        const style = {
            width: this.props.size + 'px',
            height: this.props.size + 'px'
        };

        return (
            <div className={classes.join(' ')} style={style}>
                {children}
            </div>
        );
    }
}
