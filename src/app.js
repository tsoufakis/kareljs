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

const CheatSheet = React.createClass({
    getInitialState() {
        return {reference: {commands: [], conditionals: []}};
    },
    componentDidMount() {
        const req = new XMLHttpRequest();
        req.addEventListener('load', () => {
            const reference = JSON.parse(req.responseText);
            this.setState({reference: reference});
        });
        req.open('GET', './reference.json');
        req.send();
    },
    render() {
        function makeItem(data) {
            return <li><code>{data.code}</code> {data.desc}</li>;
        }

        const commands = this.state.reference.commands.map(makeItem);
        const conditionals = this.state.reference.conditionals.map(makeItem);

        return (
            <div>
                <h1>Commands</h1>
                <section>
                    <ul className="referenceList">
                        {commands}
                    </ul>
                </section>
                <h1>Conditionals</h1>
                <section>
                    <ul className="referenceList">
                        {conditionals}
                    </ul>
                </section>
            </div>
        );
    }
});

const Popup = React.createClass({
    propTypes: {
        onClose: React.PropTypes.func.isRequired
    },
    render() {
        return (
            <aside className="popup">
                {this.props.children}
                <a href="#" className="closeButton" onClick={this.props.onClose}></a>
            </aside>
        );
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
        return {showExamplePopup: false};
    },
    openExample() {
        this.setState({showExamplePopup: true});
    },
    closeExample() {
        this.setState({showExamplePopup: false});
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
        let popup;
        let exampleLink;
        let board;

        if (this.state.showExamplePopup) {
            popup = (
                <Popup onClose={this.closeExample}>
                    <p className="examplePopupText">This is what the board should look like after running your program</p>
                    <BoardView rows={this.props.finalRows}/>
                </Popup>
            );
        }

        if (this.props.rows) {
            board = <BoardView rows={this.props.rows}/>;
            exampleLink = <a href="#" onClick={this.openExample}>Show example.</a>;
        }

        return (
            <section>
                <p><strong>Objective:</strong> {this.props.objective} {exampleLink}</p>
                {board}
                {popup}
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
            buttonMsg: 'Run Code',
            cheatSheetOpen: false
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
    showCheatSheet() {
        this.setState({cheatSheetOpen: true});
    },
    closeCheatSheet() {
        this.setState({cheatSheetOpen: false});
    },
    render() {
        let cheatSheet;

        if (this.state.cheatSheetOpen) {
            cheatSheet = (
                <Popup onClose={this.closeCheatSheet}>
                    <CheatSheet/>
                </Popup>
            );
        }

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="submit" value={this.state.buttonMsg}></input>
                    <LevelSelect levels={this.props.levels} onNewLevel={this.props.onNewLevel}/>
                    <a href="#" className="cheatSheetLink" onClick={this.showCheatSheet}>Show cheat sheet</a>
                    <Editor onChange={this.onCodeChange}/>
                </form>
                {cheatSheet}
            </div>
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
