'use strict'

const React = require('react'),
      ReactDOM = require('react-dom'),
      models = require('./models.js'),
      Karel = models.Karel,
      Board = models.Board,
      Compass = models.Compass;

const BEARING_TO_CLASS_NAME = {};
BEARING_TO_CLASS_NAME[models.Compass.NORTH] = 'wallNorth';
BEARING_TO_CLASS_NAME[models.Compass.EAST]  = 'wallEast';
BEARING_TO_CLASS_NAME[models.Compass.SOUTH] = 'wallSouth';
BEARING_TO_CLASS_NAME[models.Compass.WEST]  = 'wallWest';

const CellObject = React.createClass({
    margin: 5,
    render() {
        const imgSize = this.props.cellSize - 2 * this.margin;
        const style = {
            width: imgSize,
            height: imgSize,
            'marginLeft': this.margin,
            'marginTop': this.margin,
        }
        return <img src={this.props.src} className="cellObj" style={style}/>
    }
});

const Cell = React.createClass({
    render() {
        const cell = this.props.cell;
        const children = [];
        let classes = ['cell'];

        classes = classes.concat(cell.walls.map(function(bearing) {
            return BEARING_TO_CLASS_NAME[bearing]; 
        }));

        if (cell.beepers > 0) {
            children.push(<CellObject src="./beeper.png" cellSize={this.props.size}/>)
        }

        if (cell.karel) {
            children.push(<CellObject src={`./karel${cell.karelBearing}.png`} cellSize={this.props.size}/>)
        }

        const style = {
            width: this.props.size + 'px',
            height: this.props.size + 'px'
        };

        return (
            <div className={classes.join(' ')} style={style}>
                {children}
            </div>
        );
    }
});

const BoardView = React.createClass({
    cellSize: 80,
    render() {
        // put board in order it will be drawn
        const coordSys = this.props.rows;
        let rows = [];
        for (let y = (coordSys[0].length - 1); y >= 0; y--) {
            let cells = [];
            rows.push(cells);
            for (let x = 0; x < coordSys.length; x++) {
                cells.push(coordSys[x][y]);
            }
        }

        // turn the rows and cells into elements
        rows = rows.map((row) => {
            let cells = row.map((cell) => {
                return <Cell size={this.cellSize} cell={cell} />
            });
            return <div className="row"> {cells} </div>;
        });

        const style = {
            width: this.props.rows.length * this.cellSize + 'px',
            height: this.props.rows[0].length * this.cellSize + 'px'
        }

        return <section className="board" style={style}>{rows}</section>
    }
});

const BoardPanel = React.createClass({
    getDefaultProps() {
        return {
            rows: null,
            finalRows: null,
            objective: 'Select a level from the dropdown.'
        };
    },
    getInitialState() {
        return {
            popupStyle: {display: 'none'}
        };
    },
    showExample() {
        if (this.props.finalRows) {
            this.setState({
                popupStyle: {display: 'block'}
            });
        }
    },
    closePopup() {
        this.setState({
            popupStyle: {display: 'none'}
        });
    },
    handleTabClick(index) {
        console.log('tab click', index);
    },
    _renderTabBar() {
        const makeLabel = (label, i) => {
            let className = 'tab';

            if (i === this.props.activeTabIndex) {
                className += ' activeTab';
            }

            return (
                <li key={i}>
                    <a href="#" className={className} onClick={this.handleTabClick.bind(this, i)}>
                        {label}
                    </a>
                </li>
            );
        };

        return (
            <ul className="tabBar">
                {this.props.tabLabels.map(makeLabel)}
            </ul>
        );
    },
    render() {
        const exampleLinkStyle = this.props.finalRows ? {} : {display: 'none'};
        return (
            <section>
                <p><strong>Objective:</strong> {this.props.objective} <a href="#" onClick={this.showExample} style={exampleLinkStyle}>Show example.</a></p>
                {/* this._renderTabBar() */}
                {this.props.rows && <BoardView rows={this.props.rows}/>}
                <aside className="goalPopup" style={this.state.popupStyle}>
                    <p className="goalPopupText">This is what the board should look like after running your program</p>
                    {this.props.finalRows && <BoardView rows={this.props.finalRows}/>}
                    <a href="#" className="closeButton" onClick={this.closePopup}></a>
                </aside> 
            </section>
        );
    }
});

const LevelSelect = React.createClass({
    handleLevelChange(e) {
        this.props.onNewLevel(parseInt(e.target.value, 10));
    },
    render() {
        const options = this.props.levels.map(function(title, i) {
            return <option value={i}>{title}</option>
        });

        options.unshift(
            <option selected disabled hidden style={{display: 'none'}} value=''></option>
        );

        return (
            <select id='levelSelect' onChange={this.handleLevelChange}>
                {options}
            </select>
        );
    },
});

const Editor = React.createClass({
    defaultValue: 'Type your commands for Malstrom here.',
    componentDidMount() {
        const cm = CodeMirror.fromTextArea(this.refs.textarea, {
            mode:  "javascript",
            lineNumbers: true,
            indentUnit: 4
        });
        cm.setSize('100%', '600px');
        cm.on('focus', this.onFocus);
        cm.on('blur', this.onBlur);
        cm.on('change', this.onCodeMirrorValueChanged);
    },
    onFocus(cm) {
        if (cm.getValue() == this.defaultValue) {
            cm.setValue('');
        }
    },
    onBlur(cm) {
        if (cm.getValue() === '') {
            cm.setValue(this.defaultValue);
        }
    },
    onCodeMirrorValueChanged(cm, change) {
        if (this.props.onChange && change.origin != 'setValue') {
            this.props.onChange(cm.getValue());
        }
    },
    render() {
        return (
            <textarea className="editor" onChange={this.props.onChange} defaultValue={this.defaultValue} ref="textarea"></textarea>
        );
    }
});

const CodePanel = React.createClass({
    getInitialState() {
        return {
            code: '',
            buttonMsg: 'Run Code'
        };
    },
    handleSubmit(e) {
        e.preventDefault();

        if (!this.state.code) {
            return;
        }

        if (this.state.buttonMsg === 'Run Code') {
            this.props.onRunCode(this.state.code);
            this.setState({buttonMsg: 'Reset Board'});
        } else {
            this.props.onResetBoard();
            this.setState({buttonMsg: 'Run Code'});
        }
    },
    onCodeChange(code) {
        this.setState({code: code})
    },
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="submit" value={this.state.buttonMsg}></input>
                <LevelSelect levels={this.props.levels} onNewLevel={this.props.onNewLevel}/>
                <Editor onChange={this.onCodeChange}/>
            </form>
        );
    }
});

const karelCommands = [
    'turnLeft', 'turnRight', 'move', 'beepersPresent', 'pickBeeper',
    'putBeeper', 'frontIsBlocked', 'frontIsClear', 'leftIsBlocked',
    'leftIsClear', 'rightIsBlocked', 'rightIsClear'
];

const App = React.createClass({
    MS_PER_FRAME: 250,
    getInitialState() {
        return {
            configs: []
        };
    },
    componentDidMount() {
        karelCommands.map((cmd) => {
            window[cmd] = () => {
                try {
                    return this.state.karel[cmd]();
                } catch(e) {
                    this.setState({error: e});
                }
            };
        });
        const req = new XMLHttpRequest();
        req.addEventListener('load', () => {
            const configs = JSON.parse(req.responseText);
            this.setState({configs: configs});
        });
        req.open('GET', './levels.json');
        req.send();
    },
    onRunCode(code) {
        eval(code);
        this.renderResults();
    },
    renderResults() {
        const id = setInterval(() => {
            const frame = this.state.karel.frames.shift();
            this.setState({boardRows: frame});

            if (this.state.karel.frames.length === 0) {
                clearInterval(id);
                if (this.state.error) {
                    setTimeout(() => {
                        alert(this.state.error);
                    }, this.MS_PER_FRAME);
                }
            }
        }, this.MS_PER_FRAME);
    },
    onResetBoard() {
        this.onNewLevel(this.state.id);
    },
    onNewLevel(id) {
        if (this.state.configs.length === 0) {
            return;
        }
        const config = this.state.configs[id];
        const r = Board.fromConfig(config);
        const finalR = Board.fromConfig(config, true);
        this.setState({
            id: id,
            karel: r.karel,
            boardRows: r.karel.toJSON(),
            objective: config.objective,
            finalRows: finalR.karel.toJSON()
        });
    },
    render() {
        const levels = this.state.configs.map((c) => {
            return c.title;
        });

        return (
            <section id="container">
                <section id="col1" className="columns">
                    <CodePanel onRunCode={this.onRunCode} onResetBoard={this.onResetBoard} levels={levels} onNewLevel={this.onNewLevel}/>
                </section>
                <section id="col2" className="columns">
                    <BoardPanel rows={this.state.boardRows}
                                finalRows={this.state.finalRows}
                                objective={this.state.objective}
                                tabLabels={['3x3', '4x4', '5x6']}
                                activeTabIndex={1}
                    />
                </section>
            </section>
        );
    }
});

ReactDOM.render(<App/>, document.getElementById('app'));
