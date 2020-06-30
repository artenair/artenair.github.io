import PassageDirection from "./PassageDirection";
import Passage from "./Passage";

export default class Tile {

    constructor() {
        this._visited = false;
        this._neighbours = {}
        PassageDirection.getAllowedDirections().forEach(
            direction => this._neighbours[direction] = null
        );
    }

    hasBeenVisited() {
        return this._visited;
    }

    visit() {
        this._visited = true;
    }

    setNeighbour(neighbour, direction, distance = Infinity) {
        if(!PassageDirection.allows(direction)) return null;
        this._neighbours[direction] = new Passage(neighbour, distance);
    }

    getNeighbour(direction) {
        if(!PassageDirection.allows(direction)) return null;
        return this._neighbours[direction];
    }

    getNeighbours() {
        return PassageDirection.getAllowedDirections().map(
            direction => {
                if(!this._neighbours.hasOwnProperty(direction)) return null;
                const passage = this._neighbours[direction];
                if(!passage.hasDestination()) return null;
                return {direction, passage};
            }
        ).filter( neighbour => !! neighbour );
    }

    getUnvisitedNeighbours() {
        return PassageDirection.getAllowedDirections().map(
            direction => {
                if(!this._neighbours.hasOwnProperty(direction)) return null;
                const passage = this._neighbours[direction];
                if(!passage.hasDestination() || passage.getDestination().hasBeenVisited()) return null;
                return {direction, passage};
            }
        ).filter( neighbour => !! neighbour )
    }

}