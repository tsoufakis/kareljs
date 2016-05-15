import React from 'react';
import BoardView from './BoardView';
import { Board } from '../models';


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
        this.updateKarel(nextProps);
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

    renderFrames() {
        const id = setInterval(() => {
            const frame = this.state.karel.frames.shift();
            this.setState({currentRows: frame});

            if (this.state.karel.frames.length === 0) {
                clearInterval(this.state.intervalId);
                if (this.state.error) {
                    setTimeout(() => {
                        alert(this.state.error);
                        this.setState({error: null});
                    }, AnimatedBoard.MS_PER_FRAME);
                }
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
