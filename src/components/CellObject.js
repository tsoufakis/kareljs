import React from 'react';

export default class CellObject extends React.Component {
    constructor() {
        super();
        this.margin = 5;
    }
    render() {
        const imgSize = this.props.cellSize - 2 * this.margin;
        const style = {
            width: imgSize,
            height: imgSize,
            'marginLeft': this.margin,
            'marginTop': this.margin,
        }
        return <img src={this.props.src} className="cellObj" style={style}/>
    }
}
