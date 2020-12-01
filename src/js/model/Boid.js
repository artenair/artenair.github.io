import Point from "../geometry/Point";
import Vector2 from "../geometry/Vector2";
import RegularPolygon from "../geometry/RegularPolygon";
import Rectangle from "../geometry/Rectangle";

export default class Boid {

    /**
     * @param position Vector2
     * @param lookingAt number
     * @param radius number
     * @param sides number
     * @params speed number
     */
    constructor(
        position,
        lookingAt,
        radius = 10,
        sides = 3,
        speed = -1,
        loopAround = false,
        boundaries = null,
        fov = 3 * Math.PI / 2
    ) {
        this.speedMagnitude = speed > 0 ? speed : 5 + Math.random() * 15;
        this.position = position;
        this.speed = new Vector2(
            this.speedMagnitude * Math.cos(lookingAt),
            this.speedMagnitude * Math.sin(lookingAt)
        );
        this.sides = 3;
        this.radius = radius;
        this.loopAround = loopAround;
        this.boundaries = boundaries instanceof Rectangle ? boundaries : null;
        this.fov = fov;
    }

    getSkeleton() {
        return new RegularPolygon(this.sides, this.position, this.radius, this.speed.getTetha());
    }

    getPosition() {
        return this.position;
    }

    getRadius() {
        return this.radius;
    }

    getSpeed() {
        return this.speed;
    }

    move() {
        let dx = this.speed.getX();
        let dy = this.speed.getY();
        let nextX = this.position.getX() + dx;
        let nextY = this.position.getY() + dy;

        if(this.loopAround && this.boundaries instanceof Rectangle) {
            if(nextX < this.boundaries.getOrigin().getX()) {
                dx += this.boundaries.getWidth();
            }
            if(nextX > this.boundaries.getDestination().getX()) {
                dx -= this.boundaries.getWidth();
            }
            if(nextY < this.boundaries.getOrigin().getY()) {
                dy += this.boundaries.getHeight();
            }
            if(nextY > this.boundaries.getDestination().getY()) {
                dy -= this.boundaries.getHeight();
            }
        }
        this.position = this.position.add(new Vector2(dx, dy));
        return this;
    }

    flock(neighbours) {
        const alignment = this.applyAlignment(neighbours);
        // const separation = this.applySeparation(neighbours);
        this.speed = alignment;
        return this;
    }

    /**
     * @param neighbours
     * @returns {Vector2}
     */
    applySeparation(neighbours) {
        let separation = new Vector2(0,0);
        if(neighbours.length <= 1) return separation;
        neighbours.forEach( neighbour => {
           if(neighbour === this) return;
            const direction = separation.add(neighbour.getPosition());
            const magnitude = this.getPosition().asPoint().getDistance(neighbour.getPosition().asPoint());
            separation = separation.add(
                direction.multiply(1 / magnitude)
            );
        });
        return separation.flipX().flipY();
    }

    /**
     * @param neighbours
     * @returns {Vector2}
     */
    applyAlignment(neighbours) {
        let alignment = new Vector2(0,0);
        if(neighbours.length <= 1) return alignment;
        const aggregate = neighbours.reduce( (accumulator, neighbour) => {
            if(neighbour === this) return accumulator;
            return accumulator.add(
                neighbour.getSpeed()
            );
        }, alignment);
        const avg = aggregate.multiply(1 / neighbours.length - 1);
        this.debugVector(avg, "Average");
        const maxSpeedAvg = avg.setMagnitude(this.speedMagnitude);
        this.debugVector(avg, "Max speed average");
        const desiredVelocity = maxSpeedAvg.subtract(this.speed);
        this.debugVector(avg, "Desired velocity");
        return desiredVelocity;
    }

    debugVector(vector, message) {
        const x = vector.getX();
        const y = vector.getY();
        if(isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) {
            console.log(vector);
            throw new Error(message);
        }
    }

    /**
     * @param neighbours
     * @returns {Vector2}
     */
    applyCohesion(neighbours) {
        return new Vector2(0,0);
    }

}