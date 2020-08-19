import Point from "./Point";

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
            this._length = Math.sqrt(
                Math.pow(this._end.getX() - this._start.getX(), 2) +
                Math.pow(this._end.getY() - this._start.getY(), 2)
            )
        }
        return this._length;
    }

    getDistanceFromCircle(circle) {
        const a = new Edge(this.getStart(), circle.getCenter()).getLength();
        const b = this.getLength();
        const c = new Edge(this.getStart(), circle.getCenter()).getLength();
        const triangleArea = Math.sqrt(
            (a+b+c) * (-a+b+c) * (a-b+c) * (a+b-c)
        ) / 4;
        return 2 * triangleArea / b;
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


        const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if(denominator === 0) return null;

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
        const u = - ((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator

        if(t <= 0 || t >= 1 || u <= 0) return null;

        return new Point(
            x1 + t * (x2 - x1),
            y1 + t * (y2 - y1)
        )
    }
}
