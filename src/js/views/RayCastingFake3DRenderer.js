import PassageDirection, {Direction} from "../model/PassageDirection";
import Edge from "../geometry/Edge";
import Point from "../geometry/Point";

export default class RayCastingFake3DRenderer {

    constructor(canvas, engine) {
        this._canvas = canvas;
        this._engine = engine;
    }

    /**
     * @param {Point} position
     * @param {Vector2[]} rays
     * @param {Edge[]} bounds
     */
    render(position, rays, bounds) {
        this._engine.strokeWeight(1);
        this._engine.stroke(255, 255, 255);

        const intersections = rays.map( ray => {
            const rayAsEdge = new Edge(
                position,
                new Point(
                    position.getX() + ray.getXComponent(),
                    position.getY() + ray.getYComponent()
                )
            );
            return bounds.reduce(
                /**
                 * @param {Point} closestIntersectionPoint
                 * @param {Edge} edge
                 * @returns {Point}
                 */
                (closestIntersectionPoint, edge) => {
                    const intersection = edge.getIntersection(rayAsEdge);
                    if(!intersection) return closestIntersectionPoint;
                    if(!closestIntersectionPoint) return intersection;
                    const bestDistanceUntilNow = closestIntersectionPoint.getDistance(position);
                    const currentDistance = intersection.getDistance(position);
                    return currentDistance < bestDistanceUntilNow ? intersection : closestIntersectionPoint;
                },
                null
            )
        });

        const width = this._canvas.width / intersections.length;
        const canvasHeight = this._canvas.height;
        let maxDistance = this._canvas.width;

        intersections.forEach( (intersection, index) => {
            const intersectionDistance = position.getDistance(intersection);
            const intersectionAngle = position.getAngleBetween(intersection, true);
            const interpolatedDistance = Math.abs(Math.cos(intersectionAngle) * intersectionDistance);
            const height = this._engine.map(interpolatedDistance * 2 / 3, 0, maxDistance, canvasHeight, 0);

            this._engine.fill(
                this._engine.map(interpolatedDistance, 0, maxDistance, 255, 0)
            )

            this._engine.noStroke();
            this._engine.rectMode(this._engine.CENTER);
            this._engine.rect(
                index * width + width / 2,
                canvasHeight / 2,
                width + 1,
                height
            );
        });
    }
}
