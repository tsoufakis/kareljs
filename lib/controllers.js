'use strict'

const models = require('./models'),
      views = require('./views'),
      Karel = models.Karel,
      Board = models.Board,
      Compass = models.Compass;

const configs = [
    {
        boards: [
            {
                width: 5,
                height: 3,
                walls: [
                    {x: 3, y: 0, bearing: 0},
                    {x: 3, y: 0, bearing: 3},
                    {x: 4, y: 0, bearing: 0}
                ],
                initialState: {
                    beepers: [
                        {x: 2, y: 0, cnt: 1}
                    ],
                    karel: {x: 0, y: 0, bearing: 1}
                },
                finalState: {
                    beepers: [
                        {x: 3, y: 1, cnt: 1}
                    ]
                },
                notes: 'Just a simple board'
            }
        ],
        objective: 'Have Karel pick up the beeper at (2, 0) and move it to (3, 1).',
        title: '1.1: Around the corner'
    },
    {
        boards: [
            {
                width: 4,
                height: 4,
                walls: [],
                initialState: {
                    beepers: [],
                    karel: {x: 0, y: 0, bearing: 1}
                },
                finalState: {
                    beepers: [
                        {x: 0, y: 0, cnt: 1},
                        {x: 1, y: 1, cnt: 1},
                        {x: 2, y: 2, cnt: 1},
                        {x: 3, y: 3, cnt: 1}
                    ]
                },
                notes: 'Just a simple board'
            }
        ],
        objective: 'Have Karel lay down a diagonal line of beepers going from the bottom left corner to the top right.',
        title: '1.2: Diagonal'
    }
];

class Controller {
    constructor() {
        this.runUserCode = this.runUserCode.bind(this);
        this.resetBoard = this.resetBoard.bind(this);
        this.onLevelChange = this.onLevelChange.bind(this);

        this.runButton = document.getElementById('runButton');

        this.runButton.addEventListener('click', this.runUserCode);

        this.levelSelectView = views.createLevelSelect(this.onLevelChange);
        const levels = configs.map((c) => {
            return c.title;
        });
        this.levelSelectView.setState({levels: levels});

        // init the text box
        this.cm = CodeMirror.fromTextArea(document.getElementById('codePad'), {
            mode:  "javascript",
            lineNumbers: true,
            indentUnit: 4
        });
        this.initValue = this.cm.getValue();
        this.cm.setSize('95%', '500px');
        this.cm.on('focus', (cm) => {
            var value = cm.getValue();
            if (value === this.initValue) {
                cm.setValue('');
            }
        });
        this.cm.on('blur', (cm) => {
            var value = cm.getValue();
            if (value === '') {
                cm.setValue(this.initValue);
            }
        });
    }

    newBoard(config) {
        this.config = config;
        this.setupBoard();
    }

    setupBoard() {
        const r = Board.fromConfig(this.config);
        this.board = r.board;
        this.karel = r.karel;
        this.error = null;
        this.boardView = views.createBoard(this.config.boards[0].width, this.config.boards[0].height);
        this.boardView.setState({rows: this.karel.toJSON(), objective: this.config.objective});
    }

    onLevelChange(i) {
        app.newBoard(configs[i]);
    }

    runUserCode(s) {
        this.runButton.removeEventListener('click', this.runUserCode);

        // Nice XSS vulnerability here!
        eval(this.cm.getValue());

        this.runButton.addEventListener('click', this.resetBoard);
        this.runButton.textContent = 'Reset Board';
        this.renderResults();
    }

    resetBoard() {
        this.runButton.removeEventListener('click', this.resetBoard);
        this.setupBoard();
        this.runButton.addEventListener('click', this.runUserCode);
        this.runButton.textContent = 'Run Code';
    }

    renderResults() {
        const id = setInterval(() => {
            const frame = this.karel.frames.shift();
            this.boardView.setState({rows: frame});

            if (this.karel.frames.length === 0) {
                clearInterval(id);
                if (this.error) {
                    setTimeout(() => {
                        alert(this.error);
                    }, Controller.MS_PER_FRAME);
                }
            }
        }, Controller.MS_PER_FRAME);
    }
}

Controller.MS_PER_FRAME = 250;

// defining these in global scope for eval
const karelCommands = [
    'turnLeft', 'turnRight', 'move', 'beepersPresent', 'pickBeeper',
    'putBeeper', 'frontIsBlocked', 'frontIsClear', 'leftIsBlocked',
    'leftIsClear', 'rightIsBlocked', 'rightIsClear'
];

karelCommands.map(function(cmd) {
    window[cmd] = function() {
        try {
            return app.karel[cmd]();
        } catch(e) {
            app.error = e;
        }
    };
});

let app = new Controller();
