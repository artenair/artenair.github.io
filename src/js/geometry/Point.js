export default class Point {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    getX() {
        return this._x;
    }

    setX(x){
        this._x = x;
    }

    setY(y){
        this._y = y;
    }

    getY() {
        return this._y;
    }

    getDistance(point) {
        return Math.sqrt(
            Math.pow(this.getX() - point.getX(), 2) +
            Math.pow(this.getY() - point.getY(), 2)
        )
    }
}
