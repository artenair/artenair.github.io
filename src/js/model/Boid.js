import Point from "../geometry/Point";
import Vector2 from "../geometry/Vector2";
import RegularPolygon from "../geometry/RegularPolygon";
import Rectangle from "../geometry/Rectangle";
import p5 from "p5";

export default class Boid {

    /**
     *
     * @param position
     * @param lookingAt
     * @param radius
     * @param sides
     * @param speed
     * @param loopAround
     * @param boundaries
     * @param fov
     * @param maxSteering
     */
    constructor(
        position,
        lookingAt,
        radius = 10,
        sides = 3,
        speed = 15,
        loopAround = false,
        boundaries = null,
        fov = 3 * Math.PI / 2,
        maxSteering = 0.2
    ) {
        this.speedMagnitude = speed > 0 ? speed : 5 + Math.floor(Math.random() * 15);
        this.position = position;
        this.speed = new p5.Vector(
            this.speedMagnitude * Math.cos(lookingAt),
            this.speedMagnitude * Math.sin(lookingAt)
        );
        this.sides = 3;
        this.radius = radius;
        this.loopAround = loopAround;
        this.boundaries = boundaries instanceof Rectangle ? boundaries : null;
        this.fov = fov;
        this.acceleration = new p5.Vector(0,0);
        this.maxSteering = maxSteering;
    }

    getSkeleton() {
        return new RegularPolygon(
            this.sides,
            this.position,
            this.radius,
            this.speed.heading()
        );
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
        this.speed = this.speed.add(this.acceleration);
        this.speed.setMag(this.speedMagnitude);
        this.position.add(this.speed);

        if(this.loopAround && this.boundaries instanceof Rectangle) {
            if(this.position.x < this.boundaries.getOrigin().getX()) {
                this.position.x += this.boundaries.getWidth();
            }
            if(this.position.x > this.boundaries.getDestination().getX()) {
                this.position.x -= this.boundaries.getWidth();
            }
            if(this.position.y < this.boundaries.getOrigin().getY()) {
                this.position.y += this.boundaries.getHeight();
            }
            if(this.position.y > this.boundaries.getDestination().getY()) {
                this.position.y -= this.boundaries.getHeight();
            }
        }
        return this;
    }

    flock(neighbours) {
        let steering = new p5.Vector(0,0);
        steering.add(this.applySeparation(neighbours));
        steering.add(this.applyAlignment(neighbours));
        steering.add(this.applyCohesion(neighbours));
        this.acceleration = steering;
        return this;
    }

    /**
     * @param neighbours
     * @returns {Vector2}
     */
    applyCohesion(neighbours) {
        let cohesion = new p5.Vector(0,0);
        if(neighbours.length <= 1) return cohesion;
        for(let neighbour of neighbours) {
            if(neighbour === this) continue;
            cohesion.add(neighbour.getPosition());
        }
        cohesion.div(neighbours.length - 1);
        cohesion.sub(this.getPosition());
        cohesion.setMag(this.speedMagnitude);
        cohesion.sub(this.getSpeed());
        cohesion.limit(this.maxSteering);
        return cohesion;
    }

    /**
     * @param neighbours
     * @returns {Vector2}
     */
    applyAlignment(neighbours) {
        let alignment = new p5.Vector(0,0);
        if(neighbours.length <= 1) return alignment;
        for(let neighbour of neighbours) {
            if(neighbour === this) continue;
            alignment.add(neighbour.getSpeed());
        }
        alignment.div(neighbours.length - 1);
        alignment.setMag(this.speedMagnitude);
        alignment.sub(this.getSpeed());
        alignment.limit(this.maxSteering);
        return alignment;
    }

    applySeparation(neighbours) {
        let separation = new p5.Vector(0,0);
        if(neighbours.length <= 1) return separation;
        for(let neighbour of neighbours) {
            if(neighbour === this) continue;
            const diff = p5.Vector.sub(this.getPosition(), neighbour.getPosition());
            const p1 = new Point(this.getPosition().x, this.getPosition().y);
            const p2 = new Point(neighbour.getPosition().x, neighbour.getPosition().y);
            diff.div(p1.getSquaredDistance(p2));
            separation.add(diff);
        }
        separation.div(neighbours.length - 1);
        separation.setMag(this.speedMagnitude);
        separation.sub(this.getSpeed());
        separation.limit(this.maxSteering);
        return separation;
    }
}