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

    newBoard(nrows, ncols, cellLen) {
        this.nrows = nrows;
        this.ncols = ncols;
        this.cellLen = cellLen;
        this.setupBoard();
    }

    setupBoard() {
        this.board = new Board(this.nrows, this.ncols);
        this.karel = new Karel(0, 0, Compass.EAST, this.board, true);
        this.boardView = views.createBoard(this.nrows * this.cellLen, this.ncols * this.cellLen);
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
        const that = this;
        const id = setInterval(() => {
            const frame = this.karel.frames.shift();
            this.boardView.setState({rows: frame});

            if (this.karel.frames.length === 0) {
                clearInterval(id);
            }
        }, 250);
    }
}

// defining these in global scope for eval
const karelCommands = [
    'turnLeft', 'turnRight', 'move', 'beepersPresent', 'pickBeeper',
    'putBeeper', 'frontIsBlocked', 'frontIsClear', 'leftIsBlocked',
    'leftIsClear', 'rightIsBlocked', 'rightIsClear'
];

karelCommands.map(function(cmd) {
    window[cmd] = function() {
        return app.karel[cmd]();
    };
});

let app = new Controller();
app.newBoard(4, 3, 100);
// app.runUserCode('move(); move(); turnLeft(); move(); turnLeft(); move(); putBeeper(); move(); turnRight(); turnRight(); move(); pickBeeper(); move();');
// app.renderResults();
