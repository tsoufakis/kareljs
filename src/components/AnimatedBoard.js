import React from 'react'
import BoardView from './BoardView'
import { Board } from '../Karel'
import KarelInterface from '../KarelInterface'
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

        const karel = new KarelInterface(props.config)

        this.setState({
            karel: karel,
            currentRows: karel.initialRows
        });

        if (props.code) {
            const { frames, error } = karel.evalCode(props.code)
            this.renderFrames(frames, error)
        }
    }

    notifyComplete(error) {
        const finalState = this.state.currentRows
        const desiredFinalState = this.state.karel.finalRows

        const completedBoard = isEqual(finalState, desiredFinalState) && !error
        this.props.onComplete(completedBoard, error)
    }

    renderFrames(frames, error) {
        const id = setInterval(() => {

            if (frames.length === 0) {
                clearInterval(this.state.intervalId);
                this.notifyComplete(error)
            } else {
                const frame = frames.shift();
                this.setState({currentRows: frame.rows});
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
