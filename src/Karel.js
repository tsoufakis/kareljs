'use strict';

class Compass {
    static projectToXY(bearing) {
        switch(bearing) {
            case Compass.NORTH:
                return [0, 1];
            case Compass.EAST:
                return [1, 0];
            case Compass.SOUTH:
                return [0, -1];
            case Compass.WEST:
                return [- 1, 0];
        }
    }

    static left90(bearing) {
        let dir = bearing - 1;
        if (dir < 0) {
            dir = 3;
        }
        return dir;
    }

    static right90(bearing) {
        let dir = bearing + 1;
        if (dir > 3) {
            dir = 0;
        }
        return dir;
    }

    static reverse(bearing) {
        return Compass.right90(Compass.right90(bearing));
    }
}

Compass.NORTH = 0;
Compass.EAST = 1;
Compass.SOUTH = 2;
Compass.WEST = 3;

class RanIntoWallError extends Error {
    constructor() {
        super()
        this.name = 'RanIntoWallError'
        this.message = 'Karel ran into a wall'
    }
}

class NoBeepersPresentError extends Error {
    constructor() {
        super()
        this.name = 'NoBeepersPresentError'
        this.message = 'There are no beepers on this spot'
    }
}

class Karel {
    constructor(x, y, bearing, board, storeFrames=true) {
        this.x = x;
        this.y = y;
        this.bearing = bearing;
        this.board = board;
        this.cell = board.getCell(x, y);
        this.storeFrames = storeFrames;
        this.frames = [];
    }

    turnLeft() {
        this.bearing = Compass.left90(this.bearing);
        this.checkStoreFrames();
    }

    turnRight() {
        this.bearing = Compass.right90(this.bearing);
        this.checkStoreFrames();
    }

    move() {
        if (this.cell.directionIsBlocked(this.bearing)) {
            throw new RanIntoWallError();
        }

        const [dx, dy] = Compass.projectToXY(this.bearing);
        this.x += dx;
        this.y += dy;
        this.cell = this.board.getCell(this.x, this.y);

        this.checkStoreFrames();
    }

    beepersPresent() {
        return this.cell.beepers > 0;
    }

    pickBeeper() {
        if (this.cell.beepers == 0) {
            throw new NoBeepersPresentError();
        } else {
            this.cell.beepers--;
        }
        this.checkStoreFrames();
    }

    putBeeper() {
        this.cell.beepers++;
        this.checkStoreFrames();
    }

    checkStoreFrames() {
        if (this.storeFrames) {
            this.frames.push(this.toJSON());
        }
    }

    frontIsBlocked() {
        return this.cell.directionIsBlocked(this.bearing);
    }

    frontIsClear() {
        return !this.frontIsBlocked();
    }

    leftIsBlocked() {
        return this.cell.directionIsBlocked(Compass.left90(this.bearing));
    }

    leftIsClear() {
        return !this.leftIsBlocked();
    }

    rightIsBlocked() {
        return this.cell.directionIsBlocked(Compass.right90(this.bearing));
    }

    rightIsClear() {
        return !this.rightIsBlocked();
    }

    toJSON() {
        const json = [];
        for (let x = 0; x < this.board.width; x++) {
            json.push([]);
            for (let y = 0; y < this.board.height; y++) {
                let cell = this.board.board[x][y]
                json[x][y] = cell.toJSON();
                if (x == this.x && y == this.y) {
                    json[x][y].karel = true;
                    json[x][y].karelBearing = this.bearing;
                }
            }
        }
        return json;
    }
}

class Cell {
    constructor() {
        this.beepers = 0;
        this.walls = {}
    }

    addWall(direction) {
        this.walls[direction] = true;
    }

    removeWall(direction) {
        this.walls[direction] = false;
    }

    directionIsBlocked(direction) {
        return !!this.walls[direction];
    }

    toJSON() {
        var walls = Object.keys(this.walls).filter(function(bearing) {
            return this.walls[bearing] == true;
        }.bind(this)).map(function(n) { return parseInt(n, 10) });
        return {walls: walls, beepers: this.beepers};
    }
}

class Board {
    constructor(width, height, beepers=[], walls=[]) {
        this.board = [];
        this.width = width;
        this.height = height;

        for (let x = 0; x < width; x++) {
            this.board.push([]);

            for (let y = 0; y < height; y++) {
                let cell = new Cell();

                if (x == 0) {
                    cell.addWall(Compass.WEST);
                }

                if (x == (width - 1)) {
                    cell.addWall(Compass.EAST);
                }
                
                if (y == 0) {
                    cell.addWall(Compass.SOUTH);
                }
                
                if (y == (height - 1)) {
                    cell.addWall(Compass.NORTH);
                }

                this.board[x][y] = cell;
            }
        }

        for (let i = 0; i < walls.length; i++) {
            const wall = walls[i];
            this.addWall(wall.x, wall.y, wall.bearing);
        }

        for (let i = 0; i < beepers.length; i++) {

            const b = beepers[i];
            this.board[b.x][b.y].beepers = b.cnt;
        }
    }

    getCell(x, y) {
        return this.board[x][y];
    }

    addWall(x, y, direction) {
        const cell = this.getCell(x, y);
        cell.addWall(direction);

        const [dx, dy] = Compass.projectToXY(direction);
        const adjCell = this.getCell(x + dx, y + dy);
        adjCell.addWall(Compass.reverse(direction));
    }
}

Board.fromConfig = function(config, index, useFinalState=false) {
    const b1 = config.boards[index];
    const init = useFinalState ? b1.finalState : b1.initialState;
    const board = new Board(b1.width, b1.height, init.beepers, b1.walls);
    const karel = new Karel(init.karel.x, init.karel.y, init.karel.bearing, board);
    return {board: board, karel: karel};
}

module.exports = {
    Karel: Karel,
    Cell: Cell,
    Board, Board,
    CELL_SIZE: 80,
    Compass
};
