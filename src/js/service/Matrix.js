export default class Matrix {

    /**
     * @param {number} width
     * @param {number} height
     * @param {*} defaultValue
     */
    constructor(width, height, defaultValue = null) {
        this.width = width;
        this.height = height;
        this.data = Array(width * height).fill(defaultValue);
    }

    /**
     * @return {number}
     */
    getWidth() {
        return this.width;
    }

    /**
     * @return {number}
     */
    getHeight() {
        return this.height
    }

    get(x, y) {
        const index = this._getIndex(x, y);
        if(index >= this.data.length) return null;
        return this.data[index];
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {*} value
     * @return {boolean}
     */
    set(x, y, value) {
        const index = this._getIndex(x, y);
        if(index >= this.data.length) return false;
        this.data[index] = value;
        return true;
    }

    /**
     * @private
     * @param {number} x
     * @param {number}y
     * @return {number}
     */
    _getIndex(x, y) {
        return y * this.width + x
    }

    /**
     * @private
     * @param index
     * @return {number}
     */
    _getIndexXComponent(index) {
        return index % this.width;
    }

    /**
     * @private
     * @param index
     * @return {number}
     */
    _getIndexYComponent(index) {
        return Math.floor(index / this.width);
    }

    forEach(callback, context = null) {
        this.data.forEach((value, index) => {
            if(context) callback.bind(context);
            callback(
                this,
                this._getIndexXComponent(index),
                this._getIndexYComponent(index)
            );
        });
    }
}
