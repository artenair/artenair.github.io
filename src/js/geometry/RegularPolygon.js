import Point from "./Point";

export default class RegularPolygon {

    constructor(sides, center, radius = 10, startingAngle = 0) {
        this._vertices = [];
        const shiftingAngle = Math.PI * 2 / sides;
        for(let i = 0; i < sides; i++) {
            this._vertices[i] = new Point(
                radius * Math.cos(startingAngle + i * shiftingAngle) + center.getX(),
                radius * Math.sin(startingAngle + i * shiftingAngle) + center.getY()
            )
        }
    }

    getVertices() {
        return this._vertices.values();
    }

    getNearestVertexTo(point) {
        return this._vertices.reduce( (nearestVertex, vertex) => {
            if(!nearestVertex) return vertex;
            return vertex.getDistance(point) < nearestVertex.getDistance(point) ? vertex : nearestVertex;
        }, null);
    }

    [Symbol.iterator]() {
        return this._vertices.values()
    }
}


