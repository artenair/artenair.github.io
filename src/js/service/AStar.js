import MinHeap from "./MinHeap";
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
        const tiles = this._maze.getTiles();
        const linearIndex = this._maze.coordinatesToLinear(this._start.x, this._start.y);
        const nodeComparator = (a, b) => { return a.priority < b.priority ? -1 : ( a.priority > b.priority ? 1 : 0) };
        const nodePriorityChanger = (element, priority) => element.priority = priority;

        this._open = new MinHeap(
            [{index: linearIndex, priority: 0}],
            nodeComparator,
            nodePriorityChanger
        );
        this._openLookup = {linearIndex : true};


        this._path = [];
        this._g = tiles.map((tile, index) =>  Infinity);
        this._f = tiles.map((tile, index) =>  Infinity);
        this._g[linearIndex] = 0;
        this._f[linearIndex] = this._heuristic(this._start, this._end);
    }

    run() {
        while(!this._open.isEmpty()) {
            const {index} = this._open.pop();
            this._openLookup[index] = false;

            const {coords, tile} = this._maze.getTiles()[index];

            if(coords.x === this._end.x && coords.y === this._end.y) {
                return;
            }

            const neighbours = tile.getNeighbours()
                .filter( ({direction, passage}) => {
                    return passage.getDistance() !== Infinity
                });

            neighbours.forEach( ({direction, passage}) => {
                const neighbourIndex = this.applyDirection(index, direction);
                const gCandidate = this._g[index] + passage.getDistance();
                if(gCandidate < this._g[neighbourIndex]) {
                    const neighbourCoords = this._maze.linearToCoordinate(neighbourIndex);
                    this._path[neighbourIndex] = index;
                    this._g[neighbourIndex] = gCandidate;
                    this._f[neighbourIndex] = this._g[neighbourIndex] + this._heuristic(neighbourCoords, this._end);
                    if(!this._openLookup[neighbourIndex]) {
                        this._open.push({
                            index: neighbourIndex,
                            priority : this._g[neighbourIndex]
                        });
                        this._openLookup[neighbourIndex] = true;
                    } else {
                        this._open.changePriority(neighbourIndex, this._g[neighbourIndex])
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