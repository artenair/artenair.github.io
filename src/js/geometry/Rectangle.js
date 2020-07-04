import Point from "./Point";

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
