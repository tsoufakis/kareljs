import React from 'react'
import $ from 'jquery'
import AnimatedBoard from './AnimatedBoard'
import { connect } from 'react-redux'
import CodeMirror from 'react-codemirror'
import 'codemirror/mode/javascript/javascript'
import { Link } from 'react-router'
import Console from './Console'


class Level extends React.Component {
    constructor() {
        super()

        this.handleAnimationComplete = this.handleAnimationComplete.bind(this)
        this.persistCodeToServer = this.persistCodeToServer.bind(this)
        this.handleCodeChange = this.handleCodeChange.bind(this)
        this.handleSubmitCode = this.handleSubmitCode.bind(this)
        this.handleResetBoard = this.handleResetBoard.bind(this)
        this.state = {
            codeToRun: '',
            codeInEditor: 'Type your commands here...',
            consoleLines: ['Welcome to the console']
        }
    }

    persistCodeToServer() {
        this.setState({ savePending: false })
        const data = { code: this.state.codeInEditor, token: this.props.token }
        $.ajax(`/api/user/code/${this.props.params.id}`, {
            method: 'PUT',
            data: data,
        }).done((res) => {
        })
    }

    handleAnimationComplete(completedBoard, errorMessage) {
        let message
        if (completedBoard) {
            message = 'Congratulations, you completed the level'
        } else if (errorMessage) {
            message = errorMessage
        } else {
            message = 'Your code has finished, but you didn\'t reach your goal'
        }
        this.setState({ consoleLines: [ ...this.state.consoleLines, message ] })
    }

    handleCodeChange(code) {
        this.setState({ codeInEditor: code })

        // Use a semaphore so we don't hammer the server with saves
        if (!this.state.savePending) {
            this.setState({ savePending: true })
            setTimeout(this.persistCodeToServer, 2000)
        }
    }

    componentDidMount() {
        $.get('/static/levels.json', (levels) => {
            const level = levels.find(level => level.id === Number(this.props.params.id));
            this.setState({level: level});
        });
        $.get(`/api/user/code/${this.props.params.id}?token=${this.props.token}`)
            .done((data) => {
                if (data.success) {
                    this.setState({codeInEditor: data.code})
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
        const codeMirrorOptions = {
            mode:  'javascript',
            lineNumbers: true,
            indentUnit: 4
        }

        return (
            <div>
                <link rel="stylesheet" type="text/css" href="/static/level.css"/>
                <h1 className="pageTitle">Level {this.props.params.id}</h1>
                <button type="button" onClick={this.handleSubmitCode}>Run Code</button>
                <button type="button" onClick={this.handleResetBoard}>Reset Board</button>
                <Link to={`/app/level-description/${this.props.params.id}`} target="_blank">Description</Link>
                <div id="container">
                    <section id="codePadContainer">
                        <CodeMirror
                            value={this.state.codeInEditor}
                            onChange={this.handleCodeChange}
                            options={codeMirrorOptions}
                            className="editor"
                        />
                    </section>
                    <section id="boardContainer">
                        { this.state.level &&
                            <AnimatedBoard
                                config={this.state.level}
                                code={this.state.codeToRun}
                                onComplete={this.handleAnimationComplete}
                            />
                        }
                    </section>
                    <Console lines={this.state.consoleLines}/>
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
