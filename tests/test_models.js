'use strict'

const assert = require('chai').assert;
const { Karel, Cell, Board, Compass } = require('../lib/models');

function testCompass() {
    assert.equal(Compass.WEST, Compass.left90(Compass.NORTH));
    assert.equal(Compass.NORTH, Compass.right90(Compass.WEST));
    assert.equal(Compass.EAST, Compass.right90(Compass.NORTH));
    assert.deepEqual(Compass.projectToXY(Compass.NORTH), [0, 1]);
    assert.deepEqual(Compass.projectToXY(Compass.EAST), [1, 0]);
    assert.deepEqual(Compass.projectToXY(Compass.SOUTH), [0, -1]);
    assert.deepEqual(Compass.projectToXY(Compass.WEST), [-1, 0]);

    console.log('Compass tests passed');
}

function testCell() {
    const cell = new Cell();

    assert(cell.beepers == 0);

    // no walls
    assert(!cell.directionIsBlocked(Compass.NORTH));
    assert(!cell.directionIsBlocked(Compass.EAST));
    assert(!cell.directionIsBlocked(Compass.SOUTH));
    assert(!cell.directionIsBlocked(Compass.WEST));

    cell.addWall(Compass.NORTH);
    assert(cell.directionIsBlocked(Compass.NORTH));
    assert(!cell.directionIsBlocked(Compass.EAST));

    cell.removeWall(Compass.NORTH);
    assert(!cell.directionIsBlocked(Compass.NORTH));

    console.log('Cell tests passed');
}

function testBoard() {
    const board = new Board(3, 3);
    let cell;

    cell = board.getCell(0, 0);
    assert(!cell.directionIsBlocked(Compass.NORTH));
    assert(!cell.directionIsBlocked(Compass.EAST));
    assert(cell.directionIsBlocked(Compass.SOUTH));
    assert(cell.directionIsBlocked(Compass.WEST));

    cell = board.getCell(1, 0);
    assert(!cell.directionIsBlocked(Compass.NORTH));
    assert(!cell.directionIsBlocked(Compass.EAST));
    assert(cell.directionIsBlocked(Compass.SOUTH));
    assert(!cell.directionIsBlocked(Compass.WEST));

    cell = board.getCell(0, 1);
    assert(!cell.directionIsBlocked(Compass.NORTH));
    assert(!cell.directionIsBlocked(Compass.EAST));
    assert(!cell.directionIsBlocked(Compass.SOUTH));
    assert(cell.directionIsBlocked(Compass.WEST));

    cell = board.getCell(1, 1);
    assert(!cell.directionIsBlocked(Compass.NORTH));
    assert(!cell.directionIsBlocked(Compass.EAST));
    assert(!cell.directionIsBlocked(Compass.SOUTH));
    assert(!cell.directionIsBlocked(Compass.WEST));

    cell = board.getCell(2, 2);
    assert(cell.directionIsBlocked(Compass.NORTH));
    assert(cell.directionIsBlocked(Compass.EAST));
    assert(!cell.directionIsBlocked(Compass.SOUTH));
    assert(!cell.directionIsBlocked(Compass.WEST));

    board.addWall(1,1, Compass.EAST);
    cell = board.getCell(1,1);
    assert(cell.directionIsBlocked(Compass.EAST));
    cell = board.getCell(2,1);
    assert(cell.directionIsBlocked(Compass.WEST));

    console.log('Board tests passed');
}

function testKarel() {
    const board = new Board(3, 3);
    const karel = new Karel(0, 0, Compass.NORTH, board);

    assert.equal(karel.bearing, Compass.NORTH);

    karel.move();
    assert.equal(karel.x, 0);
    assert.equal(karel.y, 1);
    assert(karel.leftIsBlocked());
    assert(karel.frontIsClear());
    assert(karel.rightIsClear());

    karel.move();
    assert(karel.frontIsBlocked());
    assert.throws(karel.move.bind(karel), 'RanIntoWallError');

    karel.turnRight();
    assert(karel.frontIsClear());
    board.addWall(0, 2, Compass.EAST);
    assert(karel.frontIsBlocked());

    assert(!karel.beepersPresent());
    assert.throws(karel.pickBeeper.bind(karel), 'NoBeepersPresentError');
    karel.putBeeper();
    assert(karel.beepersPresent());
    karel.putBeeper();
    assert(karel.beepersPresent());
    karel.pickBeeper();
    assert(karel.beepersPresent());
    karel.pickBeeper();
    assert(!karel.beepersPresent());

    console.log('Karel tests passed');
}

testCompass();
testCell();
testBoard();
testKarel();
