import Rectangle from "../geometry/Rectangle";
import Vector2 from "../geometry/Vector2";
import ParticleCollider from "../service/ParticleCollider";

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
        ParticleCollider.handle(this, particle)
    }

    update(boundary) {
        this.updateMovement(boundary);
        this.setMovement(this.getSkeleton().move(this._movement));
    }

    updateMovement(boundary) {
        boundary = boundary || new Rectangle(-Infinity, -Infinity, Infinity, Infinity);
        const newCenter = this._movement.apply(this.getSkeleton().getCenter());

        if(
            newCenter.getX() < (boundary.getOrigin().getX() + this.getSkeleton().getRadius()) ||
            newCenter.getX() > (boundary.getDestination().getX() - this.getSkeleton().getRadius())
        ) {
            this._movement = this._movement.flipX();
        }

        if(
            newCenter.getY() < (boundary.getOrigin().getY() + this.getSkeleton().getRadius()) ||
            newCenter.getY() > (boundary.getDestination().getY() - this.getSkeleton().getRadius())
        ) {
            this._movement = this._movement.flipY()
        }
    }
}
