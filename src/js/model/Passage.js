export default class Passage {
    constructor(destination, distance = Infinity) {
        this._destination = destination;
        this._distance = distance;
    }

    hasDestination() {
        return !!this._destination;
    }

    getDestination() {
        return this._destination;
    }

    getDistance() {
        return this._distance;
    }
}