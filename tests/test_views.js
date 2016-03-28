'use strict'

var views = require('../lib/views.js');

var rows = [
    [
        {walls: [0, 3], beepers: 0, karel: true, karelBearing: 0},
        {walls: [0, 2], beepers: 0},
        {walls: [0, 1], beepers: 0}
    ],
    [
        {walls: [1, 3],       beepers: 0},
        {walls: [0, 1, 2, 3], beepers: 1},
        {walls: [1, 3],       beepers: 0}
    ],
    [
        {walls: [2, 3], beepers: 0},
        {walls: [0, 2], beepers: 0},
        {walls: [1, 2], beepers: 2}
    ]
];

var board = views.createBoard(300, 300);
board.setState({rows: rows});

setTimeout(function() {
    rows[0][0].karelBearing = 1;
    board.setState({rows: rows});
}, 250);
setTimeout(function() {
    rows[0][0].karelBearing = 2;
    board.setState({rows: rows});
}, 500);
setTimeout(function() {
    rows[0][0].karelBearing = 3;
    board.setState({rows: rows});
}, 750);
setTimeout(function() {
    rows[0][0].karelBearing = 0;
    board.setState({rows: rows});
}, 1000);
