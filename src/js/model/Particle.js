import Rectangle from "../geometry/Rectangle";
import Vector2 from "../geometry/Vector2";

export default class Particle {
    constructor(skeleton, movement, mass, color) {
        this._skeleton = skeleton;
        this._movement = movement;
        this._color = color;
        this._mass = mass;
    }

    getMass() {
        return this._mass;
    }

    getSkeleton() {
        return this._skeleton;
    }

    setMovement(movement) {
        this._movement = movement;
    }

    getMovement() {
        return this._movement;
    }

    setColor(color) {
        this._color = color;
    }

    getColor() {
        return this._color;
    }

    collides(particle) {
        if(!this.getSkeleton().intersects(particle.getSkeleton())) return;
        const movement = this.getMovement();
        const otherMovement = particle.getMovement();
        const center = this.getSkeleton().getCenter();
        const otherCenter = particle.getSkeleton().getCenter();
        const deltaVX = movement.getXComponent() - otherMovement.getXComponent();
        const deltaVY = movement.getYComponent() - otherMovement.getYComponent();
        const deltaX = otherCenter.getX() - center.getX();
        const deltaY = otherCenter.getY() - center.getY();

        if(deltaVX * deltaX + deltaVY * deltaY <= 0) return;

        const theta = -Math.atan2(otherCenter.getY() - center.getY(), otherCenter.getX() - center.getX());
        const m1 = this.getMass();
        const m2 = this.getMass();

        const u1 = movement.rotate(theta);
        const u2 = otherMovement.rotate(theta);

        const v1 = new Vector2(
            (u1.getXComponent() * (m1 - m2) + u2.getXComponent() * 2 * m2) / (m1 + m2),
            u1.getYComponent()
        )

        const v2 = new Vector2(
            (u2.getXComponent() * (m1 - m2) + u1.getXComponent() * 2 * m1) / (m1 + m2),
            u1.getYComponent()
        )

        this.setMovement(v1.rotate(-theta));
        particle.setMovement(v2.rotate(-theta));
    }

    update(boundary) {
        boundary = boundary || new Rectangle(-Infinity, -Infinity, Infinity, Infinity);
        this._movement = this._skeleton.move(
            this._movement,
            boundary.getOrigin().getX(),
            boundary.getOrigin().getY(),
            boundary.getDestination().getX(),
            boundary.getDestination().getY()
        );
    }
}
