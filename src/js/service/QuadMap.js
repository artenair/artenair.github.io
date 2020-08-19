import Rectangle from "../geometry/Rectangle";
import Point from "../geometry/Point";
import Circle from "../geometry/Circle";

export default class QuadMap {

    constructor(origin, width, height, capacity = 1) {
        this._boundaries = new Rectangle(
            Math.round(origin.getX()),
            Math.round(origin.getY()),
            Math.round(width),
            Math.round(height)
        );

        this._first = null;
        this._second = null;
        this._third = null;
        this._fourth = null;
        this._maxCapacity = capacity;
        this._particles = [];
        this._expanded = false;
    }

    near(point, searchRadius, intersectionChecker = null) {
        const searchCircle = new Circle(point, searchRadius);
        if(!intersectionChecker) {
            intersectionChecker = (a, b) => {
                return a.intersects(b.getSkeleton());
            }
        }
        if(!searchCircle.intersectsRectangle(this._boundaries)) return [];
        const found = [];
        for(let particle of this._particles) {
            if(!intersectionChecker(searchCircle, particle)) continue;
            found.push(particle);
        }

        if(this._expanded) {
            this._first.near(point, searchRadius, intersectionChecker).forEach(particle => found.push(particle));
            this._second.near(point, searchRadius, intersectionChecker).forEach(particle => found.push(particle));
            this._third.near(point, searchRadius, intersectionChecker).forEach(particle => found.push(particle));
            this._fourth.near(point, searchRadius, intersectionChecker).forEach(particle => found.push(particle));
        }

        return found;
    }

    add(origin, element) {
        if(!this._boundaries.contains(origin)) return false;
        if(this._particles.length < this._maxCapacity) {
            this._particles.push(element);
            return true;
        }
        this.expand();

        if(!this._first.add(origin, element)) {
            if(!this._second.add(origin, element)) {
                if(!this._third.add(origin, element)) {
                    if(!this._fourth.add(origin, element)) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    expand() {
        if(this._expanded) return;
        const x = this._boundaries.getOrigin().getX();
        const y = this._boundaries.getOrigin().getY();
        const halfWidth = this._boundaries.getWidth() / 2;
        const halfHeight = this._boundaries.getHeight() / 2;
        this._first = new QuadMap(
            new Point(x + halfWidth, y),
            halfWidth,
            halfHeight,
            this._maxCapacity
        )

        this._second = new QuadMap(
            new Point(x, y),
            halfWidth,
            halfHeight,
            this._maxCapacity
        )

        this._third = new QuadMap(
            new Point(x, y + halfHeight),
            halfWidth,
            halfHeight,
            this._maxCapacity
        )

        this._fourth = new QuadMap(
            new Point(x + halfWidth, y + halfHeight),
            halfWidth,
            halfHeight,
            this._maxCapacity
        )
        this._expanded = true;
    }

    getChildren () {
        return [
            this._first,
            this._second,
            this._third,
            this._fourth
        ]
    }
}
