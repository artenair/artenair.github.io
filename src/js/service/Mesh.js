import Polygon from "./Mesh/Polygon";

export default class Mesh {

    /**
     * @param {Polygon[]} polygons
     */
    constructor(polygons) {
        this._index = 0;
        this._data = polygons;
    }

    next() {
        if(!this.hasMore()) return null;
        return this._data[this._index++];
    }

    reset() {
        this._index = 0;
    }

    hasMore() {
        return this._index < this._data.length;
    }

}
