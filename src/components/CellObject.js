import React from 'react';

export default class CellObject extends React.Component {
    constructor() {
        super();
    }
    render() {
        return <img src={this.props.src} className="cellContent" width="100%" height="100%"/>
    }
}
