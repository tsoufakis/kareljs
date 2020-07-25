const assert  = require('assert')

const KarelInterface = require('../src/KarelInterface')

const CONFIG = {
    boards: [
        {
            width: 5,
            height: 4,
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
            walls: [
                {x: 3, y: 0, bearing: 0},
                {x: 3, y: 0, bearing: 3},
                {x: 4, y: 0, bearing: 0}
            ]
        }
    ]
}

describe('KarelInterface', () => {
    const karel = new KarelInterface(CONFIG)

    it('should construct', () => {
        assert(karel instanceof KarelInterface)
    })

    describe('#evalCode', () => {
        it('should eval code', () => {
            const { frames, error } = karel.evalCode('move()')
            assert.equal(frames.length, 1)
            assert.equal(typeof error, 'undefined')
        })

        it('should flag syntax error - Unexpected end of input', () => {
            const { frames, error } = karel.evalCode('move(');
            assert.equal(frames.length, 0)
            assert.equal(error.line, 1)
        })

        it('should flag reference error - marv is not defined', () => {
            const { frames, error } = karel.evalCode('move();\nmarv()');
            assert.equal(frames.length, 1)
            assert.equal(error.line, 2)
        })

        it('should flag syntax error - Unexpected identifier', () => {
            const { frames, error } = karel.evalCode('move()n');
            assert.equal(frames.length, 0)
            assert.equal(error.line, 1)
        })

        it('should flag RanIntoWallError', () => {
            const { frames, error } = karel.evalCode('move()\nmove()\nmove()');
            assert.equal(frames.length, 2)
            assert.equal(error.line, 3)
        })

        it('should flag NoBeepersPresentError', () => {
            const { frames, error } = karel.evalCode('pickBeeper()');
            assert.equal(frames.length, 0)
            assert.equal(error.line, 1)
        })
    })
})
