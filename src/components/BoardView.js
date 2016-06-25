import React from 'react';
import Cell from './Cell';

export default class BoardView extends React.Component {
    constructor() {
        super();
        this.cellSize = 80;
    }

    render() {
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
        rows = rows.map((row, i) => {
            let cells = row.map((cell, j) => {
                return <Cell key={`${i}-${j}`} size={this.cellSize} cell={cell} />
            });
            return <div key={i} className="row"> {cells} </div>;
        });

        const style = {
            width: this.props.rows.length * this.cellSize + 'px',
            height: this.props.rows[0].length * this.cellSize + 'px'
        }

        return <section className="board" style={style}>{rows}</section>
    }
}