import Point from "./Point";

export default class Vector2 {
    constructor(x, y) {
        this._x = x;
        this._y = y;
        this._tetha = null;
        this._length = null;
    }

    getXComponent() {
        return this._x;
    }

    getYComponent() {
        return this._y;
    }

    getX() {
        return this._x;
    }

    getY() {
        return this._y;
    }

    getTetha() {
        if(!this._tetha) {
            this._tetha = Math.atan2(this._y, this._x);
        }
        return this._tetha;
    }

    getMagnitude() {
        if(!this._length) {
            this._length = Math.sqrt(this._x * this._x + this._y * this._y);
        }
        return this._length;
    }

    setMagnitude(magnitude) {
        this._x = magnitude * Math.cos(this.getTetha()) ;
        this._y = magnitude * Math.sin(this.getTetha());
        this._length = magnitude;
        return this;
    }


    static random(minLength = 0, maxLength = Infinity){
        const directionX = Math.random() > .5 ? 1 : -1;
        const directionY = Math.random() > .5 ? 1 : -1;

        return new Vector2(
            (minLength + Math.random() * (maxLength - minLength)) * directionX,
            (minLength + Math.random() * (maxLength - minLength)) * directionY
        )
    }

    apply(point) {
        return new Point(
            this._x + point.getX(),
            this._y + point.getY(),
        )
    }

    asPoint() {
        return new Point(
            this._x,
            this._y
        );
    }

    flipX() {
        return new Vector2(
            -this._x,
            this._y
        )
    }

    flipY() {
        return new Vector2(
            this._x,
            -this._y
        )
    }

    rotate(theta) {
        const sin = Math.sin(theta);
        const cos = Math.cos(theta);

        return new Vector2(
            this.getXComponent() * cos - this.getYComponent() * sin,
            this.getXComponent() * sin + this.getYComponent() * cos
        )
    }

    add(vector) {
        return new Vector2(
            this.getXComponent() + vector.getXComponent(),
            this.getYComponent() + vector.getYComponent(),
        )
    }

    subtract(vector) {
        return new Vector2(
            this.getXComponent() - vector.getXComponent(),
            this.getYComponent() - vector.getYComponent(),
        )
    }

    multiply(multiplier) {
        return new Vector2(
            this.getXComponent() * multiplier,
            this.getYComponent() * multiplier,
        )
    }

    getPerpendicular() {
        return new Vector2(-this.getYComponent(), this.getXComponent());
    }
}
