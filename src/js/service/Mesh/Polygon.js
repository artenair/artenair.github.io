export default class Polygon {

    constructor(...args) {
        this._vertices = args;
    }

    getVertices() {
        return this._vertices;
    }
}
