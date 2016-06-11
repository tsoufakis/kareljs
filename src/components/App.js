import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
    render() {
        return (
            <div>
                <h1>Mole March</h1>
                <ul>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Signup</Link></li>
                    <li><Link to="/level-select">Select Level</Link></li>
                </ul>
                {this.props.children}
            </div>
        );
    }
});
