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
        this._pathLimit = 0;
        this._drawVersion = "nothing";
        this._framesPerMovement = 6;
    }

    getCanvasSmallSide() {
        if(!this._canvasSmallSide) {
            this._canvasSmallSide = Math.min(this._canvas.width, this._canvas.height);
        }
        return this._canvasSmallSide;
    }

    render( path, mouse, cheese ) {
        this._engine.background("#FFF");

        const startCoodinates = this._maze.linearToCoordinate(path[0]);
        this._engine.noStroke();
        this._engine.fill(250,0,200);
        this._engine.square(
            startCoodinates.x * this._cellSide + this._padding,
            startCoodinates.y * this._cellSide + this._padding,
            this._cellSide
        );

        this._maze.getTiles().forEach((tileContainer, index) => {
            this._engine.noStroke();
            this._engine.noFill();
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


        if(this._engine.frameCount % this._framesPerMovement === 0) {
            this._pathLimit = Math.min(path.length - 2, this._pathLimit + 1);
            this._drawVersion = this.getDrawAction(
                this._maze.linearToCoordinate(path[this._pathLimit]),
                this._maze.linearToCoordinate(path[this._pathLimit + 1])
            );
        }


        const mouseCoordinates = this._maze.linearToCoordinate(path[this._pathLimit]);
        const nextMouseCoordinates = this._maze.linearToCoordinate(path[this._pathLimit + 1]);
        const cheeseCoordinates = this._maze.linearToCoordinate(path[path.length - 1]);

        this._engine.image(
            cheese,
            cheeseCoordinates.x * this._cellSide + this._padding,
            cheeseCoordinates.y * this._cellSide + this._padding,
            this._cellSide,
            this._cellSide
        );

        for(let i = 1; i <= this._pathLimit; i++) {
            const startCoords = this._maze.linearToCoordinate(path[i - 1]);
            const endCoords = this._maze.linearToCoordinate(path[i]);
            this._engine.strokeWeight(Math.floor(this._padding / 2));
            this._engine.strokeWeight(1);
            this._engine.stroke(150);
            this._engine.line(
                2 * this._padding + this._cellSide * startCoords.x,
                2 * this._padding + this._cellSide * startCoords.y,
                2 * this._padding + this._cellSide * endCoords.x,
                2 * this._padding + this._cellSide * endCoords.y
            )
        }

        const shiftedMouseCoordinates = this.shiftMouse(
            mouseCoordinates,
            nextMouseCoordinates,
            (this._engine.frameCount % this._framesPerMovement) / this._framesPerMovement
        );

        switch (this._drawVersion) {
            case "nothing":
                this._engine.push();
                this._engine.imageMode(this._engine.CENTER);
                this._engine.image(
                    mouse,
                    shiftedMouseCoordinates.x,
                    shiftedMouseCoordinates.y,
                    this._cellSide,
                    this._cellSide
                );
                this._engine.pop();
                break;
            case "flip":
                this._engine.push();
                this._engine.translate(this._cellSide, 0)
                this._engine.scale(-1,1);
                this._engine.imageMode(this._engine.CENTER);
                this._engine.image(
                    mouse,
                    - (shiftedMouseCoordinates.x - this._cellSide),
                    shiftedMouseCoordinates.y,
                    this._cellSide,
                    this._cellSide
                );
                this._engine.pop();
            break;
            case "rotateUp":
                this._engine.push();
                this._engine.translate(
                    shiftedMouseCoordinates.x,
                    shiftedMouseCoordinates.y
                );
                this._engine.rotate(this._engine.HALF_PI);
                this._engine.imageMode(this._engine.CENTER);
                this._engine.image(
                    mouse,
                    0,
                    0,
                    this._cellSide,
                    this._cellSide
                );
                this._engine.pop();
            break;
            case "rotateDown":
                this._engine.push();
                this._engine.translate(
                    shiftedMouseCoordinates.x,
                    shiftedMouseCoordinates.y
                );
                this._engine.rotate(-this._engine.HALF_PI);
                this._engine.imageMode(this._engine.CENTER);
                this._engine.image(
                    mouse,
                    0,
                    0,
                    this._cellSide,
                    this._cellSide
                );
                this._engine.pop();
            break;
        }

        if(this._pathLimit + 2 === path.length) {
            this._engine.noLoop();
        }
    }

    shiftMouse(start, end, shift) {
        const difference = {
            x: (end.x - start.x) * shift,
            y: (end.y - start.y) * shift
        };
        return {
            x: this._cellSide * (start.x + difference.x) + this._padding + Math.floor(this._cellSide / 2),
            y: this._cellSide * (start.y + difference.y) + this._padding + Math.floor(this._cellSide / 2),
        };
    }

    getWalls({coords, tile}) {
        return PassageDirection.getAllowedDirections().map(direction => {
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

    getDrawAction(start, end) {
        const difference = {
            x: end.x - start.x,
            y: end.y - start.y
        };

        let action = "nothing";

        if(difference.x > 0) {
            action = "flip";
        }

        if(difference.y < 0) {
            action = "rotateUp";
        } else if(difference.y > 0) {
            action = "rotateDown";
        }

        return action;
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