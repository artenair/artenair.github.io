import Point from "./Point";

export default class Circle {

    constructor(center, radius) {
        this._center = center;
        this._radius = Math.floor(radius);
    }

    getCenter() {
        return this._center;
    }

    setCenter(center) {
        this._center = center;
    }

    getRadius() {
        return this._radius;
    }

    setRadius(radius) {
        this._radius = radius;
    }

    intersects(circle) {
        const centerDistance = this.getCenter().getDistance(circle.getCenter());
        const radiusSum = this.getRadius() + circle.getRadius();
        return centerDistance <= radiusSum;
    }

    intersectsRectangle(rectangle) {
        return this
            .getCenter()
            .getDistance(
                rectangle.getClosestCornerTo(this.getCenter())
            ) <=this.getRadius();
    }

    getArea() {
        return Math.PI * Math.pow(this.getRadius(),2);
    }

    getDiameter() {
        return this._radius * 2;
    }

    move(movement) {
        this._center = movement.apply(this.getCenter());
        return movement;
    }

    static makeRandom(maxX, maxY, minRadius, maxRadius) {
        const center = new Point(
            Math.floor(Math.random() * maxX),
            Math.floor(Math.random() * maxY)
        );
        const radius = Math.floor( minRadius + (Math.random() * (maxRadius - minRadius)) );

        if(center.getX() + radius > maxX) {
            center.setX(maxX - radius - 1);
        }

        if(center.getX() < radius) {
            center.setX(radius + 1);
        }

        if(center.getY() + radius > maxY) {
            center.setY(maxY - radius - 1);
        }

        if(center.getY() < radius) {
            center.setY(radius + 1);
        }

        return new Circle(center,radius)
    }
}
