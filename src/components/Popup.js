import React from 'react';

export default class Popup extends React.Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {
        e.preventDefault();
        this.props.onClose();
    }
    render() {
        return (
            <aside className="popup">
                {this.props.children}
                <a href="#" className="closeButton" onClick={this.handleClick}></a>
            </aside>
        );
    }
}

Popup.propTypes = {
    onClose: React.PropTypes.func.isRequired
}
