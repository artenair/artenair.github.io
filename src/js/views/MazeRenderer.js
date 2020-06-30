import PassageDirection, {Direction} from "../model/PassageDirection";

export default class MazeRenderer {

    constructor(maze, canvas, engine) {
        this._maze = maze;
        this._canvas = canvas;
        this._engine = engine;
        this._canvasSmallSide = 0;
        const maxSequenceElements = Math.max(this._maze.getColumns(), this._maze.getRows());
        this._cellSide = Math.floor(this.getCanvasSmallSide() / (maxSequenceElements + 1));
        this._padding = Math.floor(this._cellSide / 2);
    }

    getCanvasSmallSide() {
        if(!this._canvasSmallSide) {
            this._canvasSmallSide = Math.min(this._canvas.width, this._canvas.height);
        }
        return this._canvasSmallSide;
    }

    render( path ) {
        this._engine.background("#FFF");
        this._maze.getTiles().forEach((tileContainer, index) => {
            this._engine.noStroke();
            this._engine.fill("#FFF");
            this._engine.square(
                this._cellSide * tileContainer.coords.x + this._padding,
                this._cellSide * tileContainer.coords.y + this._padding,
                this._cellSide
            )

            this._engine.stroke(0);
            this.getWalls(tileContainer).forEach( line => {
                this._engine.strokeWeight(1);
                this._engine.line(line.start.x, line.start.y, line.end.x, line.end.y)
            });
        })

        const pathLimit = Math.min(
            path.length,
            Math.floor(this._engine.frameCount)
        );

        for(let i = 1; i < pathLimit; i++) {
            const startCoords = this._maze.linearToCoordinate(path[i - 1]);
            const endCoords = this._maze.linearToCoordinate(path[i]);
            this._engine.strokeWeight(Math.floor(this._padding / 2));
            this._engine.stroke(255, 0, 200);
            this._engine.line(
                2 * this._padding + this._cellSide * startCoords.x,
                2 * this._padding + this._cellSide * startCoords.y,
                2 * this._padding + this._cellSide * endCoords.x,
                2 * this._padding + this._cellSide * endCoords.y
            )
        }

        if(pathLimit === path.length) {
            this._engine.noLoop();
        }
    }

    getWalls({coords, tile}) {
        return PassageDirection.getAllowedDirections().map(direction => {
            if(coords.x === 0 && coords.y === 0 && direction === Direction.LEFT) return null;
            if(coords.x === this._maze.getColumns() - 1 && coords.y === this._maze.getRows() - 1 && direction === Direction.RIGHT) return null;
            const passage = tile.getNeighbour(direction);
            if(passage.getDistance() !== Infinity) return;
            return this.getWallForDirection(tile, direction, coords);
        }).filter( wall => !! wall );
    }

    getWallForDirection(tile, direction, coords) {
        switch (direction) {
            case Direction.TOP:
                return new Line(coords.x, coords.y, coords.x + 1, coords.y, this._cellSide, this._padding);
            case Direction.RIGHT:
                return new Line(coords.x + 1, coords.y, coords.x + 1, coords.y + 1, this._cellSide, this._padding);
            case Direction.BOTTOM:
                return new Line(coords.x, coords.y + 1, coords.x + 1, coords.y + 1, this._cellSide, this._padding);
            case Direction.LEFT:
                return new Line(coords.x, coords.y, coords.x, coords.y + 1, this._cellSide, this._padding);
        }
    }
}

class Line {
    constructor(sx, sy, ex, ey, multiplier = 1, padding = 0) {
        this._module = multiplier;
        this._padding = padding;
        this.start = {
            x : this.interpolate(sx),
            y: this.interpolate(sy)
        };

        this.end = {
            x : this.interpolate(ex),
            y: this.interpolate(ey)
        }
    }

    interpolate(value) {
        return this._module * value + this._padding;
    }
}