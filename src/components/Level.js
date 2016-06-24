import React from 'react';
import $ from 'jquery';
import AnimatedBoard from './AnimatedBoard';
import CodeEditor from './CodeEditor';
import { connect } from 'react-redux'


class Level extends React.Component {
    constructor() {
        super();

        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.handleSubmitCode = this.handleSubmitCode.bind(this);
        this.handleResetBoard = this.handleResetBoard.bind(this);
        this.state = { codeToRun: '' };
    }

    handleCodeChange(code) {
        this.setState({ codeInEditor: code });
        const data = {
            code: code,
            token: this.props.token
        }
        $.ajax(`/api/user/code/${this.props.params.id}`, {
            method: 'PUT',
            data: data,
        }).done((res) => {
            console.log('saved code', res)
        })
    }

    componentDidMount() {
        $.get('./levels.json', (levels) => {
            const level = levels.find(level => level.id === Number(this.props.params.id));
            this.setState({level: level});
        });
        $.get(`/api/user/code/${this.props.params.id}?token=${this.props.token}`)
            .done((data) => {
                if (data.success) {
                    this.setState({codeToRun: data.code})
                }
            })
    }

    handleSubmitCode(e) {
        this.setState({ codeToRun: this.state.codeInEditor });
    }

    handleResetBoard(e) {
        this.setState({ codeToRun: '' });
    }

    render() {
        return (
            <div>
                <h1>Level {this.props.params.id}</h1>
                <button type="button" onClick={this.handleSubmitCode}>Run Code</button>
                <button type="button" onClick={this.handleResetBoard}>Reset Board</button>
                <div id="container">
                    <section id="col1" className="columns">
                        <CodeEditor defaultValue="Type your commands here" onChange={this.handleCodeChange}/>
                    </section>
                    <section id="col2" className="columns">
                        { this.state.level && <AnimatedBoard config={this.state.level} code={this.state.codeToRun}/> }
                    </section>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.user.token
    }
}

export default connect(mapStateToProps)(Level)
