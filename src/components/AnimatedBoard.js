import React from 'react'
import BoardView from './BoardView'
import { Board } from '../models'
import { isEqual } from 'lodash'


export default class AnimatedBoard extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentWillMount() {
        this.updateKarel(this.props);
    }

    componentDidMount() {
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

        const { board, karel } = Board.fromConfig(props.config);

        this.setState({
            karel: karel,
            currentRows: karel.toJSON()
        });

        if (props.code) {
            this.runCode(props.code, karel);
            this.renderFrames();
        }
    }

    runCode(code, karel) {
        AnimatedBoard.KAREL_COMMANDS.map((cmd) => {
            window[cmd] = () => {
                return karel[cmd]();
            };
        });

        try {
            eval(code);
        } catch(e) {
            this.setState({error: `error: ${e}`});
        }
    }

    notifyComplete(error) {
        const finalState = this.state.karel.toJSON()
        const { karel: desiredFinalKarel } = Board.fromConfig(this.props.config, true)
        const desiredFinalState = desiredFinalKarel.toJSON()
        const completedBoard = isEqual(finalState, desiredFinalState)
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
        return <BoardView rows={this.state.currentRows}/>;
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
