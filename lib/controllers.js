'use strict'

const models = require('./models'),
      Karel = models.Karel,
      Board = models.Board,
      Compass = models.Compass;

const views = require('./views');

const Tokenizer = {
    regex: /;|\n/,

    tokenize(s) {
        var commands = s.split(this.regex);
    }
}
class Controller {
    constructor(nrows, ncols, cellLen) {
        this.board = new Board(nrows, ncols);
        this.karel = new Karel(0, 0, Compass.EAST, this.board);
        this.boardView = views.createBoard(nrows * cellLen, ncols * cellLen);
        this.commands = [];
    }

    evalCode(s) {
        // Nice XSS vulnerability here!
        eval(s);
    }
}

let app = new Controller(3, 3, 100);

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

app.evalCode('move(); move(); move(); turnRight(); move();');
