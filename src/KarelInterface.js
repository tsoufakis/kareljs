const { parse } = require('esprima')

const { Karel, Cell, Board, Compass } = require('./Karel');

const KAREL_COMMANDS = [
    'turnLeft', 'turnRight', 'move', 'beepersPresent', 'pickBeeper',
    'putBeeper', 'frontIsBlocked', 'frontIsClear', 'leftIsBlocked',
    'leftIsClear', 'rightIsBlocked', 'rightIsClear'
]

class Frame {
    constructor(rows=[], errorMessage='') {
        this.error = !!errorMessage
        this.rows = rows
        this.message = errorMessage
    }
}

class KarelInterface {
    constructor(config, boardIndex=0) {
        this.boards = config.boards
        this.boardIndex = boardIndex
        this.config = config
        this.initialRows = prepForUI(this._initKarel().toJSON()).rows
        this.finalRows = prepForUI(this._initKarel(true).toJSON()).rows
    }

    _initKarel(useFinalState=false) {
        const { karel } = Board.fromConfig(this.config, this.boardIndex, useFinalState)
        return karel
    }

    evalCode(code) {
        const karel = this._initKarel()
        // depends on if we're running in node or browser
        const global_scope = typeof window === 'undefined' ? global : window;

        KAREL_COMMANDS.map((cmd) => {
            global_scope[cmd] = () => {
                return karel[cmd]()
            };
        });



        let error

        try {
            parse(code)
        } catch(e) {
            error = { line: e.lineNumber, message: e.description, name: e.name }
            return { frames: [], error }
        }

        try {
            global_scope.eval(code);
        } catch(e) {
            const line = getLineNumber(e)
            error = { line, name: e.name, message: e.message }
        }

        const frames = karel.frames.map(prepForUI)
        return { frames, error }
    }
}

function prepForUI(coordSys) {
    // Karel's coordinate system is coordSys[col][row], but the UI
    // wants arrays as rows[row][col]
    let rows = [];
    for (let y = (coordSys[0].length - 1); y >= 0; y--) {
        let cells = [];
        rows.push(cells);
        for (let x = 0; x < coordSys.length; x++) {
            cells.push(coordSys[x][y]);
        }
    }
    return new Frame(rows)
}

function getLineNumber(e) {
    const stack = e.stack.split('\n')
    const evalLine = stack.find(el => el.indexOf('at eval') >= 0)

    const spl = evalLine.split(':')
    return Number(spl[spl.length - 2] || -1)
}

module.exports = KarelInterface
