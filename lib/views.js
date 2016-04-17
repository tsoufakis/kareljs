var React = require('react');
var ReactDOM = require('react-dom');
var models = require('./models.js');

BEARING_TO_CLASS_NAME = {};
BEARING_TO_CLASS_NAME[models.Compass.NORTH] = 'wallNorth';
BEARING_TO_CLASS_NAME[models.Compass.EAST]  = 'wallEast';
BEARING_TO_CLASS_NAME[models.Compass.SOUTH] = 'wallSouth';
BEARING_TO_CLASS_NAME[models.Compass.WEST]  = 'wallWest';

var CellObject = React.createClass({
    margin: 5,
    render: function() {
        const imgSize = this.props.cellSize - 2 * this.margin;
        const style = {
            width: imgSize,
            height: imgSize,
            'marginLeft': this.margin,
            'marginTop': this.margin,
        }
        return <img src={this.props.src} className="cellObj" style={style}/>
    }
});

var Cell = React.createClass({
    render: function() {
        const cell = this.props.cell;
        const children = [];
        let classes = ['cell'];

        classes = classes.concat(cell.walls.map(function(bearing) {
            return BEARING_TO_CLASS_NAME[bearing]; 
        }));

        if (cell.beepers > 0) {
            children.push(<CellObject src="./beeper.png" cellSize={this.props.size}/>)
        }

        if (cell.karel) {
            children.push(<CellObject src={`./karel${cell.karelBearing}.png`} cellSize={this.props.size}/>)
        }

        const style = {
            width: this.props.size + 'px',
            height: this.props.size + 'px'
        }

        return (
            <div className={classes.join(' ')} style={style}>
                {children}
            </div>
        );
    }
});

var Board = React.createClass({
    getInitialState: function() {
        return {rows: [[]], objective: ''};
    },
    cellSize: 80,
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
        rows = rows.map((row) => {
            let cells = row.map((cell) => {
                return <Cell size={this.cellSize} cell={cell} />
            });
            return <div className="row"> {cells} </div>;
        });

        var style = {
            width: this.props.cellsWide * this.cellSize + 'px',
            height: this.props.cellsTall * this.cellSize + 'px'
        }

        return <div>
                   <div>Objective: {this.state.objective}</div>
                   <div id="board" style={style}> {rows} </div>
               </div>;
    }
});

var LevelSelect = React.createClass({
    getInitialState: function() {
        return { levels: [] };
    },
    handleLevelChange: function(e) {
        this.props.onChange(parseInt(e.target.value, 10));
    },
    render: function() {
        const options = this.state.levels.map(function(title, i) {
            return <option value={i}>{title}</option>
        });

        options.unshift(
            <option selected disabled hidden style={{display: 'none'}} value=''></option>
        );

        return (
            <select id='levelSelect' onChange={this.handleLevelChange}>
                {options}
            </select>
        );
    },
});

module.exports = {
    createBoard: function(cellsWide, cellsTall) {
        return ReactDOM.render(
            <Board cellsWide={cellsWide} cellsTall={cellsTall}/>,
            document.getElementById('boardContainer')
        );
    },
    createLevelSelect: function(onChange) {
        return ReactDOM.render(
            <LevelSelect onChange={onChange} />,
            document.getElementById('levelSelectContainer')
        );
    }
};
