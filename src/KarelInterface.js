const { Karel, Cell, Board, Compass } = require('karel');

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
    }

    _initKarel() {
        const { karel } = Board.fromConfig(this.config, this.boardIndex)
        return karel
    }

    evalCode(code) {
        const karel = this._initKarel()

        KAREL_COMMANDS.map((cmd) => {
            window[cmd] = () => {
                return karel[cmd]()
            };
        });

        let error
        try {
            window.eval(code);
        } catch(e) {
            const line = getLineNumber(e)
            error = `Error running code on line ${line}: ${e.message}`
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
    return Frame(rows)
}

function getLineNumber(e) {
    const stack = e.stack.split('\n', 2)[1]
    const spl = stack.split(':')
    return spl[spl.length - 2]
}
