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
    cellSize: 80,
    render: function() {
        // put board in order it will be drawn
        const coordSys = this.props.rows;
        let rows = [];
        for (let y = (coordSys[0].length - 1); y >= 0; y--) {
            let cells = [];
            rows.push(cells);
            for (let x = 0; x < coordSys.length; x++) {
                cells.push(coordSys[x][y]);
            }
        }

        // turn the rows and cells into elements
        rows = rows.map((row) => {
            let cells = row.map((cell) => {
                return <Cell size={this.cellSize} cell={cell} />
            });
            return <div className="row"> {cells} </div>;
        });

        var style = {
            width: this.props.rows.length * this.cellSize + 'px',
            height: this.props.rows[0].length * this.cellSize + 'px'
        }

        return <section className="board" style={style}>{rows}</section>
    }
});

var BoardPanel = React.createClass({
    getInitialState() {
        return {rows: this.props.rows};
    },
    render() {
        return <Board rows={this.state.rows}/>;
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

var BoardPopup = React.createClass({
    render() {
        return (
            <aside className="goalPopup">
                <Board rows={this.props.rows}/>
            </aside> 
        );
    }
})

module.exports = {
    createBoardPanel: function(rows) {
        return ReactDOM.render(
            <BoardPanel rows={rows}/>,
            document.getElementById('boardContainer')
        );
    },

    createBoardPopup: function(rows) {
        return ReactDOM.render(
            <BoardPopup rows={rows}/>,
            document.getElementById('popupContainer')
        );
    },

    createLevelSelect: function(onChange) {
        return ReactDOM.render(
            <LevelSelect onChange={onChange} />,
            document.getElementById('levelSelectContainer')
        );
    }
};
