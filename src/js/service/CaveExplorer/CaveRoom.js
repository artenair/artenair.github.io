import Point from "../../geometry/Point";

export default class CaveRoom {

    constructor() {
        this._tiles = [];
        this._topLeft = null;
        this._bottomRight = null;
    }

    addTile(tile) {
        if(this._tiles.length === 0) {
            this._topLeft = new Point(tile.getX(), tile.getY());
            this._bottomRight = new Point(tile.getX(), tile.getY());
        }
        if(tile.getX() < this._topLeft.getX()) {
            this._topLeft.setX(tile.getX());
        }
        if(tile.getX() + 1 > this._bottomRight.getX()) {
            this._bottomRight.setX(tile.getX() + 1);
        }
        if(tile.getY() < this._topLeft.getY()) {
            this._topLeft.setY(tile.getY());
        }
        if(tile.getY() + 1 > this._bottomRight.getY()) {
            this._bottomRight.setY(tile.getY());
        }

        this._tiles.push(tile);
    }

    getTiles() {
        return this._tiles;
    }

    getSize() {
        return this._tiles.length;
    }

    getCenter() {
        if(this._tiles.length === 0) return null;
        return new Point(
            this._bottomRight.getX() - this._topLeft.getX(),
            this._bottomRight.getY() - this._topLeft.getY(),
        )
    }

}