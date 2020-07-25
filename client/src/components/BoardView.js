import React from 'react';
import Cell from './Cell';


export default class BoardView extends React.Component {
    constructor() {
        super();
    }

    render() {
        let rows = this.props.rows;

        let cellWidth = 0
        if (this.props.width && rows.length) {
            cellWidth = this.props.width / rows[0].length
        }

        // turn the rows and cells into elements
        rows = rows.map((row, i) => {
            let cells = row.map((cell, j) => {
                return <Cell key={`${i}-${j}`} cell={cell} width={cellWidth} />
            });
            return <div key={i} className="row"> {cells} </div>;
        });

        const style = {
            width: this.props.width
        }

        return <section className="board" style={style}>{rows}</section>
    }
}
