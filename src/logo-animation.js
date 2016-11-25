export const CONFIG = {
    boards: [
        {
            width: 23,
            height: 14,
            initialState: {
                beepers: [],
                karel: {x: 22, y: 0, bearing: 3}
            },
            finalState: {
                beepers: [],
                karel: {x: 4, y: 1, bearing: 1}
            },
            walls: []
        }
    ],
    gridOff: true
}

const CODE_FN = () => {
    function draw(numCells) {
        if (!beepersPresent()) {
            paintCell()
        }
        for (let i = 0; i < numCells; i++) {
            move()
            if (!beepersPresent()) {
                paintCell()
            }
        }
    }

    function run(numCells) {
        for (let i = 0; i < numCells; i++) {
            move()
        }
    }

    function toWall() {
        while(frontIsClear()) {
            move()
        }
    }

    function column(str='') {
        turnRight()
        let stepsTaken = 0
        for (let i = 0; i < str.length; i++) {
            if (str[i] === '1') {
                paintCell()
            }
            if (i < (str.length - 1)) {
                move()
                stepsTaken++
            }
        }
        turnRight()
        turnRight()
        run(stepsTaken)
        turnRight()
        if (frontIsClear()) {
            move()
        }
    }

    function letter(cols) {
        for (let col of cols) {
            column(col)
        }
        column()
    }


    function carriageReturn() {
        turnRight()
        turnRight()
        toWall()
        turnLeft()
        run(6)
        turnLeft()
    }

    const letters = {
        'M': ['11111', '1', '11111', '1', '11111'],
        'O': ['11111', '10001', '11111'],
        'L': ['11111', '00001', '00001'],
        'E': ['11111', '10101', '10101'],
        'A': ['11111', '10100', '11111'],
        'R': ['11111', '10100', '11011'],
        'C': ['11111', '10001', '10001'],
        'H': ['11111', '00100', '11111']
    }

    function goToStart() {
        run(19)
        turnRight()
        run(12)
        turnRight()
    }

    function goToEnd() {
        turnRight()
        run(6)
        turnRight()
        run(11)
        turnRight()
    }

    goToStart()
    letter(letters['M'])
    letter(letters['O'])
    letter(letters['L'])
    letter(letters['E'])
    carriageReturn()
    move()
    letter(letters['M'])
    letter(letters['A'])
    letter(letters['R'])
    letter(letters['C'])
    letter(letters['H'])
    goToEnd()
}

export const CODE_STR = `(${CODE_FN.toString()})()`
