import {Direction} from "../model/PassageDirection";

export default class AStar {

    constructor(maze, start, end, h) {
        this._maze = maze;
        this._start = start;
        this._end = end;
        this._heuristic = h;
        this._g = [];
        this._f = [];
    }

    setMaze(maze) {
        this._maze = maze;
    }

    setStart(start) {
        this._start = start;
    }

    setEnd(end) {
        this._end = end;
    }

    setHeuristics(h){
        this._heuristic = h;
    }

    setup() {
        const linearIndex = this._maze.coordinatesToLinear(this._start.x, this._start.y);
        this._open = [linearIndex];
        this._path = [];
        const tiles = this._maze.getTiles();
        this._g = tiles.map((tile, index) =>  Infinity);
        this._f = tiles.map((tile, index) =>  Infinity);
        this._g[linearIndex] = 0;
        this._f[linearIndex] = this._heuristic(this._start, this._end);
    }

    run() {
        while(this._open.length > 0) {
            const currentIndex = this.getBestCandidateIndex();
            const {coords, tile} = this._maze.getTiles()[currentIndex];

            if(coords.x === this._end.x && coords.y === this._end.y) {
                return;
            }


            this._open = this._open.filter( element => element !== currentIndex);

            const neighbours = tile.getNeighbours()
                .filter( ({direction, passage}) => {
                    return passage.getDistance() !== Infinity
                });

            neighbours.forEach( ({direction, passage}) => {
                const neighbourIndex = this.applyDirection(currentIndex, direction);
                const gCandidate = this._g[currentIndex] + passage.getDistance();
                if(gCandidate < this._g[neighbourIndex]) {
                    const neighbourCoords = this._maze.linearToCoordinate(neighbourIndex);
                    this._path[neighbourIndex] = currentIndex;
                    this._g[neighbourIndex] = gCandidate;
                    this._f[neighbourIndex] = this._g[neighbourIndex] + this._heuristic(neighbourCoords, this._end);
                    if(!this._open.includes(neighbourIndex)) {
                        this._open.push(neighbourIndex);
                    }
                }
            })
        }

        console.log("NOT FOUND AN EXIT");
    }

    getPath() {
        let iterator = this._maze.coordinatesToLinear(this._end.x, this._end.y);
        const path = [];

        while(iterator) {
            path.push(iterator);
            iterator = this._path[iterator];
        }

        path.push(this._maze.coordinatesToLinear(this._start.x, this._start.y));

        return path.reverse();
    }

    applyDirection(index, direction) {
        switch (direction) {
            case Direction.TOP:
                return index - this._maze.getColumns();
            case Direction.BOTTOM:
                return index + this._maze.getColumns();
            case Direction.LEFT:
                return index - 1;
            case Direction.RIGHT:
                return index + 1
        }
    }

    getBestCandidateIndex() {
        return this._open.map( element => {
            return {
                index: element,
                score: this._f[element]
            }
        }).reduce( (best, current) => {
            if(!best) return current;
            return current.score < best.score ? current : best;
        }).index;
    }

}