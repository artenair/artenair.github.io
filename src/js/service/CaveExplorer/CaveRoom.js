import Point from "../../geometry/Point";

export default class CaveRoom {

    constructor() {
        this._tiles = [];
        this._edges = [];
        this._topLeft = null;
        this._bottomRight = null;
    }

    addTile(tile, isEdge) {
        if(this._tiles.length === 0) {
            this._topLeft = new Point(tile.getX(), tile.getY());
            this._bottomRight = new Point(tile.getX(), tile.getY());
        }
        if(tile.getX() < this._topLeft.getX()) {
            this._topLeft.setX(tile.getX());
        }
        if(tile.getX() > this._bottomRight.getX()) {
            this._bottomRight.setX(tile.getX());
        }
        if(tile.getY() < this._topLeft.getY()) {
            this._topLeft.setY(tile.getY());
        }
        if(tile.getY() > this._bottomRight.getY()) {
            this._bottomRight.setY(tile.getY());
        }

        this._tiles.push(tile);
        if(isEdge) {
            this._edges.push(tile);
        }
    }

    getTiles() {
        return this._tiles;
    }

    getEdges() {
        return this._edges;
    }

    getSize() {
        return this._tiles.length;
    }

    getMathematicalCenter() {
        if(this._tiles.length === 0) return null;
        return new Point(
            this._topLeft.getX() + Math.ceil((this._bottomRight.getX() - this._topLeft.getX()) /2),
            this._topLeft.getY() + Math.ceil((this._bottomRight.getY() - this._topLeft.getY()) / 2),
        )
    }

    getCenter() {
        const mathematicalCenter = this.getMathematicalCenter();
        const squaredDistance = (a, b) => {
            return Math.pow(a.getX() - b.getX(), 2) + Math.pow(a.getY() - b.getY(), 2);
        };
        return this.getTiles().reduce((closestToCenter, point)  => {
            if(!closestToCenter) return point;
            const bestDistance =  squaredDistance(closestToCenter, mathematicalCenter);
            const distance = squaredDistance(point, mathematicalCenter);
            return bestDistance < distance ? closestToCenter : point;
        }, null).getPosition();
    }

    getTopLeft() {
        return this._topLeft;
    }

    getBottomRight() {
        return this._bottomRight;
    }

}
