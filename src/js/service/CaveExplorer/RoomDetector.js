import CaveRoom from "./CaveRoom";
import Matrix from "../Matrix";
import CaveTile from "./CaveTile";

export default class RoomDetector {

    constructor(marker) {
        this._marker = marker;
    }

    /**
     * @param {Matrix} map
     * @return {CaveRoom[]}
     */
    get(map) {
        const rooms = [];
        const processed = new Matrix(map.getWidth(), map.getHeight(), false);
        map.forEach((map, x, y) => {
            if(map.get(x, y) !== this._marker) return;
            if(processed.get(x, y)) return;
            const room = this._generateRoomFrom(map, x, y);
            room.getTiles().forEach( tile => {
                processed.set(tile.getX(), tile.getY(), true);
            });
            rooms.push(room);
        });
        return rooms;
    }

    _generateRoomFrom(map, x, y) {
        const room = new CaveRoom();
        const baseType = map.get(x, y);
        const enqueued = new Matrix(map.getWidth(), map.getHeight(), false);
        const queue = [new CaveTile(x, y, baseType)];
        enqueued.set(x, y, true);
        while(queue.length) {
            const candidate = queue.shift();
            const isEdge = this._candidateIsEdge(candidate, map)
            room.addTile(candidate, isEdge);
            candidate.getAdjacentPositions().forEach( position => {
                const x = position.getX();
                const y = position.getY();
                if(x < 0 || x >= map.getWidth() || y < 0 || y >= map.getHeight()) return;
                if(enqueued.get(x, y)) return;
                if(map.get(x, y) !== baseType) return;
                const tile = new CaveTile(x, y, baseType);
                queue.push(tile)
                enqueued.set(x, y, true);
            });
        }
        return room;
    }

    _candidateIsEdge(candidate, map) {
        const x = candidate.getX();
        const y = candidate.getY();
        const neighbourValues = [
            map.get(x, y - 1),
            map.get(x + 1, y),
            map.get(x, y - 1),
            map.get(x - 1, y)
        ];
        return neighbourValues.reduce((isEdge, neighbourValue) => {
            return isEdge || (neighbourValue !== null && neighbourValue !== this._marker);
        }, false);
    }

}
