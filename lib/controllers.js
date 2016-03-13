'use strict'

const { Karel, Board, Compass } = require('./models');

class Controller {
    constructor(width, height) {
        this.board = new Board(width, height);
        this.karel = new Karel(0, 0, Compass.EAST, this.board);
    }

    evalCode(s) {
        // Nice XSS vulnerability here!
        eval(s);
    }
}

let app = new Controller(3, 3);

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

app.evalCode('move(); move(); move(); console.log("hi"); move();');
