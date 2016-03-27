var React = require('react');
var ReactDOM = require('react-dom');
// { Compass } = require('./lib/models.js');

var cellLength = 100; // px


BEARING_TO_CLASS_NAME = {
    /*Compass.NORTH:*/ 0: 'wallNorth',
    /*Compass.EAST: */ 1: 'wallEast',
    /*Compass.SOUTH:*/ 2: 'wallSouth',
    /*Compass.WEST: */ 3: 'wallWest'
};

var Karel = React.createClass({
    render: function() {
        return <div className={"karel" + this.props.bearing}/>
    }
});

var Cell = React.createClass({
    render: function() {
        var cell = this.props.cell;

        classes = ['cell'];

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
        return {rows: []};
    },
    render: function() {
        var rows = this.state.rows.map(function(row) {
            var cells = row.map(function(cell) {
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

var rows = [
    [
        {walls: [0, 3], beepers: 0, karel: true, karelBearing: 0},
        {walls: [0, 2], beepers: 0},
        {walls: [0, 1], beepers: 0}
    ],
    [
        {walls: [1, 3],       beepers: 0},
        {walls: [0, 1, 2, 3], beepers: 1},
        {walls: [1, 3],       beepers: 0}
    ],
    [
        {walls: [2, 3], beepers: 0},
        {walls: [0, 2], beepers: 0},
        {walls: [1, 2], beepers: 2}
    ]
];

var board = ReactDOM.render(
    <Board width="300" height="300"/>,
    document.getElementById('app')
);

board.setState({rows: rows});
setTimeout(function() {
    rows[0][0].karelBearing = 1;
    board.setState({rows: rows});
}, 250);
setTimeout(function() {
    rows[0][0].karelBearing = 2;
    board.setState({rows: rows});
}, 500);
setTimeout(function() {
    rows[0][0].karelBearing = 3;
    board.setState({rows: rows});
}, 750);
setTimeout(function() {
    rows[0][0].karelBearing = 0;
    board.setState({rows: rows});
}, 1000);
