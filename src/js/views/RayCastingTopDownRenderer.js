import PassageDirection, {Direction} from "../model/PassageDirection";
import Edge from "../geometry/Edge";
import Point from "../geometry/Point";

export default class RayCastingTopDownRenderer {

    constructor(canvas, engine, displayBounds = true) {
        this._canvas = canvas;
        this._engine = engine;
        this._displayBounds = displayBounds;
    }

    /**
     * @param {Point} position
     * @param {Vector2[]} rays
     * @param {Edge[]} bounds
     */
    render(position, rays, bounds) {
        this._engine.circle(position.getX(), position.getY(), 20);
        this._engine.strokeWeight(1);
        this._engine.stroke(255, 255, 255);

        /**
         * @type {Point[]}
         */
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
        }).filter( intersection => !! intersection );

        this._engine.strokeWeight(1);
        this._engine.stroke(255, 255, 255);

        intersections.forEach( (intersection, index) => {
            this._engine.line(
                position.getX(),
                position.getY(),
                intersection.getX(),
                intersection.getY()
            )
        });

        if(!this._displayBounds) return;

        this._engine.stroke(125);
        bounds.forEach( (edge, index) => {
            this._engine.strokeWeight(index < 4 ? 10 : 5);
            const start = edge.getStart();
            const end = edge.getEnd();
            this._engine.line( start.getX(), start.getY(), end.getX(), end.getY());
        });
    }
}
