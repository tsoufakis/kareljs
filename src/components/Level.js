import React from 'react';

export default React.createClass({
    render() {
        return (
            <div>
                <h1>Level {this.props.params.id}</h1>
            </div>
        );
    }
});
