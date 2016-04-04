'use strict'

const assert = require('chai').assert;
const util = require('util');
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
    let board = new Board(1, 1);
    let cell = board.getCell(0, 0);
    assert(cell.directionIsBlocked(Compass.NORTH));
    assert(cell.directionIsBlocked(Compass.EAST));
    assert(cell.directionIsBlocked(Compass.SOUTH));
    assert(cell.directionIsBlocked(Compass.WEST));

    board = new Board(3, 3);
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

function testBoardConfig() {
    const config = {
        width: 5,
        height: 4,
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

    const r = Board.fromConfig(config);
    assert(r.board.width == 5);
    assert(r.board.height == 4);
    assert(r.board.getCell(2, 0).beepers == 1);
    assert(r.board.getCell(2, 0).directionIsBlocked(Compass.EAST));
    assert(r.board.getCell(3, 0).directionIsBlocked(Compass.WEST));
    assert(r.board.getCell(3, 0).directionIsBlocked(Compass.NORTH));
    assert(r.board.getCell(4, 0).directionIsBlocked(Compass.NORTH));
    assert(r.board.getCell(4, 0).directionIsBlocked(Compass.EAST));
    assert(r.karel.x == 0);
    assert(r.karel.y == 0);
    assert(r.karel.bearing == Compass.EAST);
    console.log('testBoardConfig passed');
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

function testJSON() {
    const board = new Board(3, 3);
    const karel = new Karel(0, 0, Compass.NORTH, board);
    karel.putBeeper();
    board.addWall(0, 0, Compass.EAST);
    board.addWall(0, 0, Compass.NORTH);
    var json = karel.toJSON();
    var desiredResult = [
        [
            {walls: [0,1,2,3], beepers: 1, karel: true, karelBearing: Compass.NORTH},
            {walls: [2,3], beepers: 0},
            {walls: [0,3], beepers: 0}
        ],
        [
            {walls: [2, 3], beepers: 0},
            {walls: [], beepers: 0},
            {walls: [0], beepers: 0}
        ],
        [
            {walls: [1,2], beepers: 0},
            {walls: [1], beepers: 0},
            {walls: [0, 1], beepers: 0}
        ]
    ];
    assert.deepEqual(json, desiredResult);
    console.log('JSON test passed');
}

function testStoreFrames() {
    const board = new Board(2, 1);
    const karel = new Karel(0, 0, Compass.EAST, board, true);
    assert(karel.frames.length === 0, 'Karel should have 1 stored frame');
    karel.move();
    karel.turnLeft();
    karel.putBeeper();
    assert(karel.frames.length === 3, 'stored frames');
    const frame0 = [
        [{ walls: [0,2,3], beepers: 0, karel: true, karelBearing: Compass.EAST }],
        [{ walls: [0,1,2], beepers: 0 }]
    ];

    const frame1 = [
        [{ walls: [0,2,3], beepers: 0 }],
        [{ walls: [0,1,2], beepers: 0, karel: true, karelBearing: Compass.EAST }]
    ];

    const frame2 = [
        [{ walls: [0,2,3], beepers: 0 }],
        [{ walls: [0,1,2], beepers: 0, karel: true, karelBearing: Compass.NORTH }]
    ];
    const frame3 = [
        [{ walls: [0,2,3], beepers: 0 }],
        [{ walls: [0,1,2], beepers: 1, karel: true, karelBearing: Compass.NORTH }]
    ];

    assert.deepEqual(karel.frames[0], frame1);
    assert.deepEqual(karel.frames[1], frame2);
    assert.deepEqual(karel.frames[2], frame3);

    console.log('testStoreFrames passed');
}

testCompass();
testCell();
testBoard();
testKarel();
testJSON();
testStoreFrames();
testBoardConfig();
