export default class Node {

    /**
     * @param {Point} position
     * @param {number} vertexIndex
     */
    constructor(position, vertexIndex = -1) {
        this._position = position;
        this._vertexIndex = vertexIndex;
    }

    /**
     * @return {Point}
     */
    getPosition() {
        return this._position;
    }
}
