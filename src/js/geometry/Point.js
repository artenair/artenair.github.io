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
        return Math.sqrt(this.getSquaredDistance(point));
    }

    getSquaredDistance(point) {
        return Math.pow(this.getX() - point.getX(), 2) +
            Math.pow(this.getY() - point.getY(), 2);
    }

    getAngleBetween(focus, radiants = false) {
        const delta_x = focus.getX() - this.getX();
        const delta_y = focus.getY() - this.getY();
        const rads = Math.atan2(delta_y, delta_x);
        return  radiants ? rads : rads * 180 / Math.PI;
    }
}
