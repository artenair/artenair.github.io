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
     * @returns {Graph}
     */
    connect(map) {
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
        return connections;
        const nodes = connections.getNodes();
        const edges = connections.getEdges();
        for(let roomId in edges) {
            if(!edges.hasOwnProperty(roomId)) continue;
            const heap = edges[roomId];
            heap.getDataAsArray().forEach( ({origin, destination}) => {
                const posA = origin.node.getCenter();
                const posB = destination.node.getCenter();
                const leftmostNode = posA.getX() <= posB.getX() ? posA : posB;
                const rightmostNode = posA.getX() <= posB.getX() ? posB : posA;
                const dx = rightmostNode.getX()  - leftmostNode.getX();
                const dy = rightmostNode.getY() - leftmostNode.getY();
                const yIncrement = dy / dx;
                const xIncrement = dx / dy;
                if(yIncrement > xIncrement) {
                    for(let x = 0; x < dx; x++) {
                        const y = Math.round(leftmostNode.getY() + (x * yIncrement));
                        // map.set(leftmostNode.getX() + x, y, 0);
                    }
                } else {
                    for(let y = 0; y < dy; y++) {
                        const x = Math.round(leftmostNode.getX() + (y * xIncrement));
                        // map.set(x, y + leftmostNode.getY(), 0);
                    }
                }

            })
        }

        return connections;
    }

    _getRoomId(room) {
        const center = room.getCenter();
        return `${center.getX()}_${center.getY()}`;
    }

}
