import React from 'react'
import $ from 'jquery'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/mode/javascript/javascript'

import AnimatedBoard from './AnimatedBoard'
import { CELL_SIZE } from '../Karel'
import Console from './Console'
import {
    fetchLevelStatusRequest,
    fetchLevelStatusSuccess,
    putLevelStatusRequest,
    putLevelStatusSuccess
} from '../actions'

const CODE_MIRROR_OPTIONS = {
    mode:  'javascript',
    lineNumbers: true,
    indentUnit: 4
}

class Level extends React.Component {
    constructor() {
        super()

        this.handleAnimationComplete = this.handleAnimationComplete.bind(this)
        this.persistCodeToServer = this.persistCodeToServer.bind(this)
        this.handleBeforeCodeChange = this.handleBeforeCodeChange.bind(this)
        this.handleCodeChange = this.handleCodeChange.bind(this)
        this.handleSubmitCode = this.handleSubmitCode.bind(this)
        this.handleResetBoard = this.handleResetBoard.bind(this)
        this.resizeBoard = this.resizeBoard.bind(this)
        this.state = {
            codeToRun: '',
            codeInEditor: 'Type your commands here...',
            consoleLines: ['Welcome to the console'],
            boardWidth: 0
        }
    }

    persistCodeToServer() {
        this.setState({ savePending: false })
        const data = { code: this.state.codeInEditor, token: this.props.token }
        $.ajax(`/api/user/code/${this.props.match.params.id}`, {
            method: 'PUT',
            data: data,
        }).done((res) => {
        })
    }

    resizeBoard() {
        if (!this.state.level || !this.boardContainer) {
            return
        }

        const { width: boardWidth, height: boardHeight } = this.state.level.boards[0]
        const boardAspect = boardWidth / boardHeight

        const containerWidth = this.boardContainer.clientWidth
        const containerHeight = this.boardContainer.clientHeight
        const containerAspect = containerWidth / containerHeight

        let newWidth
        const naturalWidth = boardWidth * CELL_SIZE
        if (boardAspect >= containerAspect) {
            newWidth = Math.min(containerWidth, naturalWidth)
        } else {
            newWidth = Math.min(containerHeight * boardAspect, naturalWidth)
        }

        this.setState({ boardWidth: newWidth })
    }

    handleAnimationComplete(completedBoard, error) {
        let message
        if (completedBoard) {
            message = 'Congratulations, you completed the level'
            this.props.dispatch(putLevelStatusRequest())
            $.ajax(`/api/user/progress/${this.props.match.params.id}`, {
                method: 'PUT',
                data: { token: this.props.token, completed: true }
            }).done((res) => {
                this.props.dispatch(putLevelStatusSuccess(this.props.match.params.id, true))
            })
        } else if (error) {
            message = `error on line ${error.line}: ${error.message}`
        } else {
            message = 'Your code has finished, but you didn\'t reach your goal'
        }
        this.setState({ consoleLines: [ ...this.state.consoleLines, message ] })
    }

    handleBeforeCodeChange(editor, data, value) {
        this.setState({ codeInEditor: value })
    }

    handleCodeChange(editor, data, value) {
        // this.setState({ codeInEditor: value })

        // Use a semaphore so we don't hammer the server with saves
        if (!this.state.savePending) {
            this.setState({ savePending: true })
            setTimeout(this.persistCodeToServer, 2000)
        }
    }

    componentDidMount() {
        $.get('/static/levels.json', (levels) => {
            const level = levels.find(level => level.id === Number(this.props.match.params.id))
            this.setState({level: level})
            this.resizeBoard()
        });
        $.get(`/api/user/code/${this.props.match.params.id}?token=${this.props.token}`)
            .done((data) => {
                if (data.success) {
                    this.setState({codeInEditor: data.code})
                }
            })

        this.props.dispatch(fetchLevelStatusRequest())
        $.get(`/api/user/progress/${this.props.match.params.id}?token=${this.props.token}`, (data) => {
            if (data.progress) {
                const { levelId, completed } = data.progress
                this.props.dispatch(fetchLevelStatusSuccess(levelId, completed))
            }
        })

        window.addEventListener('resize', this.resizeBoard)
    }

    handleSubmitCode(e) {
        const code = this.state.codeInEditor
        this.setState({
            codeToRun: code,
            consoleLines: []
        });
    }

    handleResetBoard(e) {
        this.setState({ codeToRun: '' });
    }

    render() {
        const completedNotification = this.props.completed ? ' (completed)' : ''
        let pageTitle
        if (this.state.level) {
            const { id, title } = this.state.level
            pageTitle = `Level ${id}: ${title}${completedNotification}`
        }

        return (
            <div>
                <link rel="stylesheet" type="text/css" href="/static/level.css"/>
                <h1 className="pageTitle">{pageTitle}</h1>
                <button type="button" onClick={this.handleSubmitCode}>Run Code</button>
                <button type="button" onClick={this.handleResetBoard}>Reset Board</button>
                <Link to={`/app/level-description/${this.props.match.params.id}`} target="_blank">Description</Link>
                <div id="container">
                    <section id="codePadContainer">
                        <CodeMirror
                            value={this.state.codeInEditor}
                            onBeforeChange={this.handleBeforeCodeChange}
                            onChange={this.handleCodeChange}
                            options={CODE_MIRROR_OPTIONS}
                            className="editor"
                        />
                    </section>
                    <section id="boardContainer" ref={(ref) => this.boardContainer = ref}>
                        { this.state.level &&
                            <AnimatedBoard
                                config={this.state.level}
                                code={this.state.codeToRun}
                                onComplete={this.handleAnimationComplete}
                                width={this.state.boardWidth}
                            />
                        }
                    </section>
                    <Console lines={this.state.consoleLines}/>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const status = state.levelStatus[ownProps.match.params.id]
    const completed = status && status.completed || false

    return {
        token: state.user.token,
        completed
    }
}

export default connect(mapStateToProps)(Level)
