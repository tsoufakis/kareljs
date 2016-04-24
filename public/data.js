window.configs = [
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
                    ],
                    karel: {x: 4, y: 1, bearing: 1}
                },
                notes: 'Just a simple board'
            }
        ],
        objective: 'Have Karel pick up the beeper at (2, 0) and move it to (3, 1).',
        title: 'On the ledge'
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
                    ],
                    karel: {x: 3, y: 3, bearing: 1}
                },
                notes: 'Just a simple board'
            }
        ],
        objective: 'Have Karel lay down a diagonal line of beepers going from the bottom left corner to the top right.',
        title: 'Diagonal'
    },
    {
        boards: [
            {
                width: 8,
                height: 3,
                walls: [],
                initialState: {
                    beepers: [],
                    karel: {x: 0, y: 0, bearing: 1}
                },
                finalState: {
                    beepers: [
                        {x: 0, y: 0, cnt: 1},
                        {x: 2, y: 0, cnt: 1},
                        {x: 4, y: 0, cnt: 1},
                        {x: 6, y: 0, cnt: 1}
                    ],
                    karel: {x: 7, y: 0, bearing: 1}
                },
                notes: 'Just a simple board'
            }
        ],
        objective: 'Have Karel lay down beepers on every other square along the bottom row.',
        title: 'Every Other'
    }
];
