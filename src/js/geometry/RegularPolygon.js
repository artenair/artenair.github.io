import Point from "./Point";
import Edge from "./Edge";

export default class RegularPolygon {

    constructor(sides, center, radius = 10, startingAngle = 0) {
        this._vertices = [];
        this._center = center;
        this._radius = radius;
        this._startingAngle = startingAngle;
        this._sides = sides;
        this.updateVertices()
    }

    updateVertices() {
        const shiftingAngle = Math.PI * 2 / this._sides;
        for(let i = 0; i < this._sides; i++) {
            this._vertices[i] = new Point(
                this._radius * Math.cos(this._startingAngle + i * shiftingAngle) + this._center.x,
                this._radius * Math.sin(this._startingAngle + i * shiftingAngle) + this._center.y
            )
        }
    }

    getCenter() {
        return this._center;
    }

    getVertices() {
        return this._vertices.map( vertex => vertex);
    }

    getClosestCornerTo(point) {
        return this._vertices.reduce( (nearestVertex, vertex) => {
            if(!nearestVertex) return vertex;
            return vertex.getSquaredDistance(point) < nearestVertex.getSquaredDistance(point) ? vertex : nearestVertex;
        }, null);
    }

    getAsEdges() {
        const edges = [];
        for(let i = 0; i < this._vertices.length; i++) {
            const start = this._vertices[i];
            const end = this._vertices[ (i + 1) % this._vertices.length ];
            edges.push(new Edge(start, end))
        }
        return edges;
    }

    intersectsEdge(edge) {
        return this.getAsEdges().reduce((intersects, rectangleEdge) => {
            const intersection = edge.getIntersection(rectangleEdge);
            return intersects || !! intersection;
        }, false)
    }

    [Symbol.iterator]() {
        return this._vertices.values()
    }
}
