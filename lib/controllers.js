'use strict'

const models = require('./models'),
      views = require('./views'),
      Karel = models.Karel,
      Board = models.Board,
      Compass = models.Compass;

class Controller {
    constructor() {
        this.runUserCode = this.runUserCode.bind(this);
        this.onCodePadFocus = this.onCodePadFocus.bind(this);
        this.onCodePadBlur = this.onCodePadBlur.bind(this);
        this.resetBoard = this.resetBoard.bind(this);

        this.runButton = document.getElementById('runButton');
        this.codePad = document.getElementById('codePad');
        this.initCodePadText = this.codePad.value;

        this.runButton.addEventListener('click', this.runUserCode);
        this.codePad.addEventListener('focus', this.onCodePadFocus);
        this.codePad.addEventListener('blur', this.onCodePadBlur);
    }

    newBoard(config, cellLen) {
        this.config = config;
        this.cellLen = cellLen;
        this.setupBoard();
    }

    setupBoard() {
        const r = Board.fromConfig(this.config);
        this.board = r.board;
        this.karel = r.karel;
        this.error = null;
        this.boardView = views.createBoard(this.config.width * this.cellLen, this.config.height * this.cellLen);
        this.boardView.setState({rows: this.karel.toJSON()});
    }

    onCodePadFocus() {
        if (this.codePad.value === this.initCodePadText) {
            this.codePad.value = '';
        }
    }

    onCodePadBlur() {
        if (!this.codePad.value) {
            this.codePad.value = this.initCodePadText;
        }
    }

    runUserCode(s) {
        this.runButton.removeEventListener('click', this.runUserCode);
        const textbox = document.getElementById('codePad');

        // Nice XSS vulnerability here!
        eval(textbox.value);

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

const config = {
    width: 5,
    height: 3,
    beepers: [
        {x: 2, y: 0, cnt: 1}
    ],
    walls: [
        {x: 3, y: 0, bearing: 0},
        {x: 3, y: 0, bearing: 3},
        {x: 4, y: 0, bearing: 0}
    ],
    karel: {x: 0, y: 0, bearing: 1}
};

let app = new Controller();
app.newBoard(config, 100);
