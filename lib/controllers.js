'use strict'

const models = require('./models'),
      views = require('./views'),
      Karel = models.Karel,
      Board = models.Board,
      Compass = models.Compass;

class Controller {
    constructor() {
        this.evaled = false;
    }

    setupBoard(nrows, ncols, cellLen) {
        this.board = new Board(nrows, ncols);
        this.karel = new Karel(0, 0, Compass.EAST, this.board, true);
        this.boardView = views.createBoard(nrows * cellLen, ncols * cellLen);
        this.boardView.setState({rows: this.karel.toJSON()});
    }

    evalCode(s) {
        // Nice XSS vulnerability here!
        eval(s);
        this.evaled = true;
    }

    renderResults() {
        const id = setInterval(function() {
            const frame = this.karel.frames.shift();
            this.boardView.setState({rows: frame});

            if (this.karel.frames.length === 0) {
                clearInterval(id);
            }
        }, 500);
    }
}

// defining these in global scope for eval
function turnLeft() { app.karel.turnLeft(); }
function turnRight() { app.karel.turnRight(); }
function move() { app.karel.move(); }
function beepersPresent() { app.karel.beepersPresent(); }
function pickBeeper() { app.karel.pickBeeper(); }
function putBeeper() { app.karel.putBeeper(); }
function frontIsBlocked() { app.karel.frontIsBlocked(); }
function frontIsClear() { app.karel.frontIsClear(); }
function leftIsBlocked() { app.karel.leftIsBlocked(); }
function leftIsClear() { app.karel.leftIsClear(); }
function rightIsClear() { app.karel.rightIsClear(); }
function rightIsClear() { app.karel.rightIsClear(); }

let app = new Controller();
app.setupBoard(3, 3, 100);
app.evalCode('move(); move(); move();');
app.renderResults();
