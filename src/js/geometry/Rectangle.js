import Point from "./Point";
import Edge from "./Edge";

export default class Rectangle {
    constructor(left, top, width, height) {
        this._topLeft = new Point(left, top);
        this._bottomRight = new Point(left + width, top + height)
    }

    getOrigin() {
        return this._topLeft;
    }

    getDestination() {
        return this._bottomRight;
    }

    getWidth() {
        return this._bottomRight.getX() - this._topLeft.getX();
    }

    getHeight() {
        return this._bottomRight.getY() - this._topLeft.getY();
    }

    contains(point) {
        return !(
            point.getX() < this._topLeft.getX() ||
            point.getX() > this._bottomRight.getX() ||
            point.getY() < this._topLeft.getY() ||
            point.getY() > this._bottomRight.getY()
        );
    }

    getAsEdges() {
        const topLeft = this.getOrigin();
        const topRight = new Point(this._topLeft.getX() + this.getWidth(), this._topLeft.getY());
        const bottomRight = new Point(this._topLeft.getX() + this.getWidth(), this._topLeft.getY() + this.getHeight());
        const bottomLeft = new Point(this._topLeft.getX(), this._topLeft.getY());
        return [
            new Edge(topLeft, topRight),
            new Edge(topRight, bottomRight),
            new Edge(bottomRight, bottomLeft),
            new Edge(bottomLeft, bottomRight),
        ]
    }

    intersectsEdge(edge) {
        return this.getAsEdges().reduce((intersects, rectangleEdge) => {
            const intersection = edge.getIntersection(rectangleEdge);
            if(intersection) {
                console.log(edge, rectangleEdge, intersection);
            }
            return intersects || !! intersection;
        }, false)
    }

    getClosestCornerTo(point) {
        let closestEdgeX = point.getX();
        let closestEdgeY = point.getY();

        if(point.getX() < this._topLeft.getX()) {
            closestEdgeX = this._topLeft.getX()
        } else if (point.getX() > this._bottomRight.getX()) {
            closestEdgeX = this._bottomRight.getX();
        }

        if(point.getY() < this._topLeft.getY()) {
            closestEdgeY = this._topLeft.getY()
        } else if (point.getY() > this._bottomRight.getY()) {
            closestEdgeY = this._bottomRight.getY();
        }

        return new Point(closestEdgeX, closestEdgeY);
    }
}
