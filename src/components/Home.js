import React from 'react'

import AnimatedBoard from './AnimatedBoard'

const CONFIG = {
    boards: [
        {
            width: 23,
            height: 11,
            initialState: {
                beepers: [],
                karel: {x: 0, y: 10, bearing: 1}
            },
            finalState: {
                beepers: [],
                karel: {x: 4, y: 1, bearing: 1}
            },
            walls: []
        }
    ]
}

const CODE_FN = () => {
    function draw(numCells) {
        if (!beepersPresent()) {
            putBeeper()
        }
        for (let i = 0; i < numCells; i++) {
            move()
            if (!beepersPresent()) {
                putBeeper()
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
                putBeeper()
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
        'R': ['11111', '10110', '11001'],
        'C': ['11111', '10001', '10001'],
        'H': ['11111', '00100', '11111']
    }

    letter(letters['M'])
    letter(letters['O'])
    letter(letters['L'])
    letter(letters['E'])
    carriageReturn()
    letter(letters['M'])
    letter(letters['A'])
    letter(letters['R'])
    letter(letters['C'])
    letter(letters['H'])
}

const CODE_STR = `(${CODE_FN.toString()})()`

export default class Home extends React.Component {
    constructor() {
        super()
        this.handleAnimationComplete = this.handleAnimationComplete.bind(this)
    }

    handleAnimationComplete(_, error) {
        console.log('done', error)
    }

    render() {
        return (
            <div className="centeredColumn">
                <br/>
                <br/>
                <br/>
                <br/>
                <h3>Welcome to Mole March. Click one of the links above to get started.</h3>
                <AnimatedBoard
                    config={CONFIG}
                    code={CODE_STR}
                    onComplete={this.handleAnimationComplete}
                    width="800"
                    msPerFrame={30}
                />
            </div>
        )
    }
}
