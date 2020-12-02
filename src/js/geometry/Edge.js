import Point from "./Point";
import {checkIntersection} from 'line-intersect';

export default class Edge {

    /**
     * @param {Point} start
     * @param {Point} end
     */
    constructor(start, end) {
        this._start = start;
        this._end = end;
        this._length = null;
    }

    getLength() {
        if(!this._length) {
            this._length = Math.sqrt(this.getSquaredLength())
        }
        return this._length;
    }

    getSquaredLength() {
        return Math.pow(this._end.getX() - this._start.getX(), 2) +
            Math.pow(this._end.getY() - this._start.getY(), 2);
    }

    /**
     * @returns {Point}
     */
    getStart() {
        return this._start;
    }

    /**
     * @returns {Point}
     */
    getEnd() {
        return this._end;
    }

    /**
     * @returns {Point}
     */
    getCenter() {
        return new Point(
            (this._start.getX() + this._end.getY()) / 2,
            (this._start.getY() + this._end.getY()) / 2,
        );
    }

    /**
     * @param {Edge} edge
     */
    getIntersection(edge) {
        const x1 = this.getStart().getX();
        const x2 = this.getEnd().getX();
        const x3 = edge.getStart().getX();
        const x4 = edge.getEnd().getX();

        const y1 = this.getStart().getY();
        const y2 = this.getEnd().getY();
        const y3 = edge.getStart().getY();
        const y4 = edge.getEnd().getY();

        const {type, point} = checkIntersection(x1,y1,x2,y2,x3,y3,x4,y4);
        return type === "intersecting" ? new Point(point.x, point.y) : null;
    }
}
