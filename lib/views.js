var React = require('react');
var ReactDOM = require('react-dom');
var models = require('./models.js');

BEARING_TO_CLASS_NAME = {};
BEARING_TO_CLASS_NAME[models.Compass.NORTH] = 'wallNorth';
BEARING_TO_CLASS_NAME[models.Compass.EAST]  = 'wallEast';
BEARING_TO_CLASS_NAME[models.Compass.SOUTH] = 'wallSouth';
BEARING_TO_CLASS_NAME[models.Compass.WEST]  = 'wallWest';

var Karel = React.createClass({
    render: function() {
        return <div className={"karel" + this.props.bearing}/>
    }
});

var Cell = React.createClass({
    render: function() {
        const cell = this.props.cell;
        let classes = ['cell'];

        classes = classes.concat(cell.walls.map(function(bearing) {
            return BEARING_TO_CLASS_NAME[bearing]; 
        }));

        if (cell.beepers > 0) {
            classes.push('beeper');
        }

        if (cell.karel) {
            classes.push('karel' + cell.karelBearing)
        }

        return (
            <div className={classes.join(' ')} />
        );
    }
});

var Board = React.createClass({
    getInitialState: function() {
        return {rows: [[]]};
    },
    render: function() {
        // put board in order it will be drawn
        const coordSys = this.state.rows;
        let rows = [];
        for (let y = (coordSys[0].length - 1); y >= 0; y--) {
            let cells = [];
            rows.push(cells);
            for (let x = 0; x < coordSys.length; x++) {
                cells.push(coordSys[x][y]);
            }
        }

        // turn the rows / cells into elements
        rows = rows.map(function(row) {
            let cells = row.map(function(cell) {
                return <Cell cell={cell} />
            });
            return <div className="row"> {cells} </div>;
        });

        var style = {
            width: this.props.width + 'px',
            height: this.props.height + 'px'
        }

        return <div id="board" style={style}> {rows} </div>;
    }
});

module.exports = {
    createBoard: function(width, height) {
        return board = ReactDOM.render(
            <Board width={width} height={height}/>,
            document.getElementById('boardContainer')
        );
    }
};
