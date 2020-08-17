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
        return graph;
    }

    _getRoomId(room) {
        const center = room.getCenter();
        return `${center.getX()}_${center.getY()}`;
    }

}