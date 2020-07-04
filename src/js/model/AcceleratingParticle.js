import Particle from "./Particle";
import Rectangle from "../geometry/Rectangle";
import Vector2 from "../geometry/Vector2";
import ParticleCollider from "../service/ParticleCollider";

export default class AcceleratingParticle extends Particle {
    constructor(skeleton, speed, acceleration, energyConservation, mass, color) {
        super(skeleton, speed, mass, color);
        this._acceleration = acceleration;
        this._energyConservation = energyConservation;
        this._stop = false;
    }

    getEnergyConservation() {
        return this._energyConservation;
    }

    update(boundary) {
        this.setMovement(this.getMovement().add(this._acceleration))
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
            this._movement = new Vector2(
                -this._movement.getXComponent() * this._energyConservation,
                this._movement.getYComponent() * this._energyConservation
            );
        }

        if(
            newCenter.getY() < (boundary.getOrigin().getY() + this.getSkeleton().getRadius()) ||
            newCenter.getY() > (boundary.getDestination().getY() - this.getSkeleton().getRadius())
        ) {
            this._movement = new Vector2(
                this._movement.getXComponent() * this._energyConservation,
                -this._movement.getYComponent() * this._energyConservation
            );
        }

        if(this._movement.getMagnitude() < 0.01) {
            const stop = new Vector2(0,0);
            this._stop = true;
            this.setMovement(stop);
            this._acceleration = stop;
        }
    }

    collides(particle) {
        ParticleCollider.handle(
            this,
            particle,
            this.getEnergyConservation(),
            particle.getEnergyConservation()
        )
    }
}
