import Tile from "./Tile";
import {Direction} from "./PassageDirection";
import PassageDirection from "./PassageDirection";

export default class Maze {
    static make(rows = 10, columns = 10) {
        return new Maze(rows, columns);
    }

    linearToCoordinate(linearIndex) {
        if(linearIndex < 0 || linearIndex > this._rows * this._columns) {
            return -1;
        }
        return {
            x : linearIndex % this._columns,
            y : Math.floor(linearIndex / this._columns)
        }
    }

    coordinatesToLinear(x, y) {
        const candidate = y * this._columns + x;
        if(candidate < 0 || candidate > this._tiles.length) return -1;
        return candidate;
    }

    constructor(rows, columns) {
        this._rows = rows;
        this._columns = columns;
        this._tiles = [];
        const elementsCount = rows * columns;
        for(let i = 0; i < elementsCount; i++) {
            this._tiles = [...this._tiles, new Tile()];
        }

        this._tiles.forEach( (tile, index) => {
            PassageDirection.getAllowedDirections().forEach(direction => {
                const neighbour = this.getNeighbour(index, direction);
                tile.setNeighbour(neighbour, direction);
            })
        })

        this.generate();
    }

    generate() {
        let current = this._tiles[0];
        current.visit();
        let elaborating = [current];
        while(elaborating.length > 0) {
            const current = elaborating.pop();
            const unvisitedNeighbours = current.getUnvisitedNeighbours();
            if(unvisitedNeighbours.length > 0) {
                elaborating.push(current);
                const randomIndex = Math.min(Math.floor(Math.random() * (unvisitedNeighbours.length)), unvisitedNeighbours.length -1);
                const next = unvisitedNeighbours[randomIndex];
                const neighbour = next.passage.getDestination();
                current.setNeighbour(neighbour, next.direction, 1);
                neighbour.setNeighbour(current, PassageDirection.reverse(next.direction), 1);
                neighbour.visit();
                elaborating.push(neighbour);
            }
        }

    }

    getRows() {
        return this._rows;
    }

    getColumns() {
        return this._columns;
    }

    getTiles() {
        return this._tiles.map( (tile, index) => {
            return {
                coords: this.linearToCoordinate(index),
                tile
            }
        })
    }

    getNeighbour(index, direction) {
        if(index < 0 || index >= this._tiles.length) return null;
        if(!PassageDirection.allows(direction)) return null;
        if(!this.validLocation(index, direction)) return null;

        const candidate = this._tiles[index].getNeighbour(direction);
        if(candidate) return candidate;
        const neighbourIndex = this.getNeighbourIndex(index, direction);
        if(neighbourIndex < 0) return null;
        return this._tiles[neighbourIndex];
    }

    getNeighbourIndex(index, direction) {
        if(!PassageDirection.allows(direction)) return -1;
        switch (direction) {
            case Direction.TOP:
                return index - this._columns;
            case Direction.BOTTOM:
                return index + this._columns;
            case Direction.LEFT:
                return index - 1;
            case Direction.RIGHT:
                return index + 1;
        }
    }

    validLocation(index, direction) {
        if(!PassageDirection.allows(direction)) return false;
        switch (direction) {
            case Direction.TOP:
                return this.getNeighbourIndex(index, direction) > 0;
            case Direction.BOTTOM:
                return this.getNeighbourIndex(index, direction) < this._tiles.length;
            case Direction.LEFT:
                return this.getNeighbourIndex(index, direction) % this._columns < this._columns - 1;
            case Direction.RIGHT:
                return this.getNeighbourIndex(index, direction) % this._columns > 0;
        }
    }
}