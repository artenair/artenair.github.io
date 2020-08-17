import Matrix from "../Matrix";
import RoomDetector from "./RoomDetector";
import Graph from "../Graph/Graph";
import Prim from "../Graph/Prim";

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

        rooms.forEach( roomA => {
            rooms.forEach( roomB => {
                if(roomB === roomA) return;
                const centerA = roomA.getCenter();
                const centerB = roomB.getCenter();
                const roomAId = this._getRoomId(roomA);
                const roomBId = this._getRoomId(roomB);
                const edgeWeight = centerB.getDistance(centerA)
                graph.addEdge(roomAId, roomBId, edgeWeight);
            })
        });

        const connections = (new Prim()).get(graph);
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
