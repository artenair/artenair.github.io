import Vector2 from "../geometry/Vector2";

export default class ParticleCollider {

    static handle(a, b, aEnergyConservation = 1, bEnergyConservation= 1) {
        if(!a.getSkeleton().intersects(b.getSkeleton())) return;
        const movement = a.getMovement();
        const otherMovement = b.getMovement();
        const center = a.getSkeleton().getCenter();
        const otherCenter = b.getSkeleton().getCenter();
        const deltaVX = movement.getXComponent() - otherMovement.getXComponent();
        const deltaVY = movement.getYComponent() - otherMovement.getYComponent();
        const deltaX = otherCenter.getX() - center.getX();
        const deltaY = otherCenter.getY() - center.getY();

        if(deltaVX * deltaX + deltaVY * deltaY <= 0) return;

        const theta = -Math.atan2(otherCenter.getY() - center.getY(), otherCenter.getX() - center.getX());
        const m1 = a.getMass();
        const m2 = b.getMass();

        const u1 = movement.rotate(theta);
        const u2 = otherMovement.rotate(theta);

        const v1 = new Vector2(
            aEnergyConservation * (u1.getXComponent() * (m1 - m2) + u2.getXComponent() * 2 * m2) / (m1 + m2),
            aEnergyConservation * u1.getYComponent()
        )

        const v2 = new Vector2(
            bEnergyConservation * (u2.getXComponent() * (m1 - m2) + u1.getXComponent() * 2 * m1) / (m1 + m2),
            bEnergyConservation * u2.getYComponent()
        )

        if(!a._stop) {
            a.setMovement(v1.rotate(-theta));
        }
        if(!b._stop) {
            b.setMovement(v2.rotate(-theta));
        }
    }

}
