import PassageDirection, {Direction} from "../model/PassageDirection";
import Edge from "../geometry/Edge";
import Point from "../geometry/Point";

export default class NightModeRayCastingRenderer {

    constructor(canvas, engine) {
        this._canvas = canvas;
        this._engine = engine;
    }

    /**
     * @param {Point} position
     * @param {Vector2[]} rays
     * @param {number} cameraRadius
     * @param {number} discoverRadius
     * @param {Edge[]} bounds
     */
    render(position, rays, cameraRadius, discoverRadius= 20, bounds= []) {
        this._engine.background(0);

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
        intersections.push(position);

        this._engine.erase();
        this._engine.push();
        this._engine.beginShape();
        intersections.forEach( intersection => {
            const xSign = Math.sign(intersection.getX() - position.getX());
            const ySign = Math.sign(intersection.getY() - position.getY());
            this._engine.vertex(intersection.getX() + xSign * 10, intersection.getY() + ySign * 10);
        });
        this._engine.endShape(this._engine.CLOSE);
        this._engine.pop();
        this._engine.fill(255);
        this._engine.circle(position.getX(), position.getY(), discoverRadius);
        this._engine.noErase();

        this._engine.circle(position.getX(), position.getY(), cameraRadius);
    }
}
