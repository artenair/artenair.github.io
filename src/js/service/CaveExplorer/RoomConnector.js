import Matrix from "../Matrix";
import RoomDetector from "./RoomDetector";
import Graph from "../Graph/Graph";
import Prim from "../Graph/Prim";
import QuadMap from "../QuadMap";
import Point from "../../geometry/Point";
import Circle from "../../geometry/Circle";
import Particle from "../../model/Particle";

export default class RoomConnector {


    constructor(marker) {
        this._marker = marker;
    }

    /**
     * @param {Matrix} map
     * @param {number} radius
     * @returns {Graph}
     */
    connect(map, radius) {
        const roomDetector = new RoomDetector(this._marker);
        const rooms = roomDetector.get(map);
        const graph = new Graph();
        rooms.forEach( room => {
            graph.addNode(this._getRoomId(room), room)
        });


        const searchRadius = Math.min(map.getWidth(), map.getHeight()) / 4;

        rooms.forEach( roomA => {
            const quadMap = new QuadMap(new Point(0, 0), map.getWidth(), map.getHeight(), 4)
            roomA.getEdges().forEach( tile => {
                const origin = new Point(tile.getX(),tile.getY());
                const skeleton = new Circle(origin, 1);
                let container = new Particle(skeleton);
                container.tile = tile;
                quadMap.add(origin, container);
            });

            rooms.forEach( roomB => {
                if(roomB === roomA) return;
                const nearestCouple = roomB.getEdges().map( (tile) => {
                    const nearTiles = quadMap.near(new Point(tile.getX(), tile.getY()), searchRadius);
                    const nearestTile = nearTiles.map(({tile}) => tile).reduce( (nearest, candidate) => {
                        if(!nearest) return candidate;
                        if(!candidate) return nearest;
                        const nearestDistance = Math.pow(
                            (nearest.getX() - tile.getX()),
                            2
                        ) + Math.pow(
                            (nearest.getY() - tile.getY()),
                            2
                        );

                        const candidateDistance = Math.pow(
                            (candidate.getX() - tile.getX()),
                            2
                        ) + Math.pow(
                            (candidate.getY() - tile.getY()),
                            2
                        );

                        return candidateDistance < nearestDistance ? candidate : nearestTile;
                    }, null )
                    if(!nearestTile) return null;
                    return {
                        origin: tile,
                        destination: nearestTile,
                        distance: Math.sqrt(
                            Math.pow((nearestTile.getX() - tile.getX()), 2) +
                            Math.pow((nearestTile.getY() - tile.getY()), 2)
                        )
                    }
                }).reduce((closestCouple, current) => {
                    if(!closestCouple) return current;
                    if(!current) return closestCouple;
                    return closestCouple.distance < current.distance ? closestCouple : current;
                }, null);

                if(!nearestCouple) return;
                const {origin, destination, distance} = nearestCouple;
                const roomAId = this._getRoomId(roomA);
                const roomBId = this._getRoomId(roomB);
                graph.addEdge(roomAId, roomBId, distance, {origin, destination});
            })
        });

        const connections = (new Prim()).get(graph);
        const edges = connections.getEdges();
        for(let roomId in edges) {
            if(!edges.hasOwnProperty(roomId)) continue;
            const heap = edges[roomId];
            heap.getDataAsArray().forEach( ({additionalInfo}) => {
                this._getLine(
                    additionalInfo.origin,
                    additionalInfo.destination
                ).forEach( point => {
                    for(let x = -radius; x <= radius; x++) {
                        for(let y = -radius; y <= radius; y++) {
                            map.set(point.getX() + x, point.getY() + y, this._marker);
                        }
                    }
                })
            })
        }
    }

    _getLine(origin, destination) {
        const line = [];
        let x = origin.getX();
        let y = origin.getY();

        const dx = destination.getX() - origin.getX();
        const dy = destination.getY() - origin.getY();

        let step = Math.sign(dx);
        let gradientStep = Math.sign(dy);

        let longest = Math.abs(dx);
        let shortest = Math.abs(dy);

        const inverted = longest < shortest;
        if(inverted) {
            shortest = Math.abs(dx);
            longest = Math.abs(dy);
            step = Math.sign(dy);
            gradientStep = Math.sign(dx);
        }

        let accumulation = longest / 2;
        for(let i = 0; i < longest; i++) {
            line.push(new Point(x, y));
            if(inverted) y += step;
            else         x += step;

            accumulation += shortest;
            if(accumulation >= longest) {
                if(inverted) x += gradientStep;
                else         y += gradientStep;
                accumulation -= longest;
            }
        }
        return line;
    }

    _getRoomId(room) {
        const center = room.getCenter();
        return `${center.getX()}_${center.getY()}`;
    }

}
