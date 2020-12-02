import Rectangle from "../../geometry/Rectangle";
import p5 from "p5";
import RegularPolygon from "../../geometry/RegularPolygon";

export default class Rocket {

    constructor(position, lifespan, dna, speedMagnitude = 15) {
        this._dna = dna;
        this._age = 0;
        this._lifespan = lifespan;
        this._speedMagnitude = speedMagnitude;
        this._speed = new p5.Vector(0,0);
        this._position = position;
        this._collided = false;
        this._success = false;
    }

    getRemainingLife() {
        return this._lifespan - this._age;
    }

    getDna() {
        return this._dna;
    }

    getPosition() {
        return this._position;
    }

    setSuccess(success  = true) {
        this._success = success;
    }

    setCollided(collided = true) {
        this._collided = collided;
    }

    getSkeleton() {
        return new RegularPolygon(
            3,
            this._position,
            10,
            this._speed.heading()
        );
    }

    getVelocity() {
        return this._speed;
    }

    isAlive() {
        return  this._age < this._lifespan &&
                this._age < this._dna.length &&
                !this._collided &&
                !this._success;
    }

    hasCollided() {
        return this._collided;
    }

    hasSucceeded() {
        return this._success;
    }

    move() {
        if(!this.isAlive()) return;

        this._speed.add(this._dna[this._age++]);
        this._speed.limit(this._speedMagnitude);
        this._position.add(this._speed);
    }

}