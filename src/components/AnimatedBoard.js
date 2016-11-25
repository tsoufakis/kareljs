import React from 'react'
import BoardView from './BoardView'
import { Board } from '../Karel'
import { isEqual } from 'lodash'


export default class AnimatedBoard extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentWillMount() {
        this.updateKarel(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.code !== this.props.code) {
            this.updateKarel(nextProps);
        }
    }

    updateKarel(props) {
        if (this.state.intervalId) {
            clearInterval(this.state.intervalId);
        }

        const { board, karel } = Board.fromConfig(props.config, 0);

        this.setState({
            karel: karel,
            currentRows: karel.toJSON()
        });

        if (props.code) {
            const error = this.runCode(props.code, karel)
            if (error) {
                this.props.onComplete(false, error)
            } else {
                this.renderFrames()
            }
        }
    }

    getLineNumber(e) {
        const stack = e.stack.split('\n', 2)[1]
        const spl = stack.split(':')
        return spl[spl.length - 2]
    }

    runCode(code, karel) {
        AnimatedBoard.KAREL_COMMANDS.map((cmd) => {
            window[cmd] = () => {
                return karel[cmd]()
            };
        });

        try {
            eval(code);
        } catch(e) {
            const line = this.getLineNumber(e)
            return `Error running code on line ${line}: ${e.message}`
        }
    }

    notifyComplete(error) {
        const finalState = this.state.karel.toJSON()
        const { karel: desiredFinalKarel } = Board.fromConfig(this.props.config, 0, true)
        const desiredFinalState = desiredFinalKarel.toJSON()
        const completedBoard = isEqual(finalState, desiredFinalState) && !error
        setTimeout(() => {
            this.props.onComplete(completedBoard, error)
        }, AnimatedBoard.MS_PER_FRAME);
    }

    renderFrames() {
        const id = setInterval(() => {
            const frame = this.state.karel.frames.shift();
            this.setState({currentRows: frame});

            if (this.state.karel.frames.length === 0) {
                clearInterval(this.state.intervalId);
                const error = this.state.error
                this.setState({error: null});
                this.notifyComplete(error)
            }
        }, AnimatedBoard.MS_PER_FRAME);

        this.setState({ intervalId: id });
    }

    render() {
        return <BoardView rows={this.state.currentRows} width={this.props.width}/>;
    }
}

AnimatedBoard.propTypes = {
    config: React.PropTypes.object.isRequired,
    code: React.PropTypes.string
};

AnimatedBoard.defaultProps = { code: '' };

AnimatedBoard.MS_PER_FRAME = 250;

AnimatedBoard.KAREL_COMMANDS = [
    'turnLeft', 'turnRight', 'move', 'beepersPresent', 'pickBeeper',
    'putBeeper', 'frontIsBlocked', 'frontIsClear', 'leftIsBlocked',
    'leftIsClear', 'rightIsBlocked', 'rightIsClear'
];
