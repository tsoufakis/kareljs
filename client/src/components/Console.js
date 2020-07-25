import PropTypes from 'prop-types';
import React from 'react'

export default class Console extends React.Component {
    componentDidMount() {
        this.scrollToBottom()
    }

    componentDidUpdate() {
        this.scrollToBottom()
    }

    scrollToBottom() {
        this.console.scrollTop = this.console.scrollHeight
    }

    render() {
        const lines = this.props.lines.map((line, i) => {
            return <p className="consoleText" key={i}>&gt; {line}</p>
        })

        return (
            <aside id="console" ref={(el) => this.console = el}>
                {lines}
            </aside>
        )
    }
}

Console.propTypes = {
    lines: PropTypes.array.isRequired
}
