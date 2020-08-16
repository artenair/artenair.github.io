export default class ControlNodeGrid {

    /**
     * @param {number} width
     * @param {number} height
     * @param {number} resolution
     */
    constructor(width, height, resolution) {
        this.width = width;
        this.height = height;
        this.resolution = resolution;

        this.shortestSide = Math.min(width, height);
        this.cellSide = Math.max( this.shortestSide / this.resolution, 5 );
    }

}
