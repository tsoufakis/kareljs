import React from 'react';
import { Compass } from '../Karel'
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

        if (cell.showGrid) {
            classes = classes.concat(cell.walls.map(function(bearing) {
                return BEARING_TO_CLASS_NAME[bearing];
            }));
            classes.push('cellGrid')
        }

        if (cell.beepers > 0) {
            children.push(<CellObject key={1} src="/static/beeper.png"/>)
        }

        if (cell.painted) {
            classes.push('beeperBg')
        }

        if (cell.karel) {
            children.push(<CellObject key={2} src={`/static/karel${cell.karelBearing}.png`}/>)
        }

        const style = { width: this.props.width, height: this.props.width }


        return (
            <div className={classes.join(' ')} style={style}>
                {children}
            </div>
        );
    }
}
