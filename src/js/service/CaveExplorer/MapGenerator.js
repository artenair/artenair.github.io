import Matrix from "../Matrix";
import RoomDetector from "./RoomDetector";
import WallRestorer from "./WallRestorer";

export default class MapGenerator {

    constructor(width, height, fillPercent) {
        this.width = width;
        this.height = height;
        this.fillPercent = Math.min(Math.max(fillPercent, 0), 1);
        this.TILE_FILLED = 1;
        this.TILE_EMPTY = 0;
    }

    /**
     * @param {NoiseGenerator} noiseGenerator
     * @param {number} smoothing
     * @param {number} threshold
     * @return {Matrix}
     */
    generate(noiseGenerator, smoothing= 0, threshold = 5) {
        let map = new Matrix(this.width, this.height, 1);
        map.forEach((map, x, y) => {
            map.set(x, y, noiseGenerator.get() <= this.fillPercent ? this.TILE_FILLED : this.TILE_EMPTY);
        });
        map = this._smooth(map, smoothing);
        map = this._removeArtifacts(map, threshold, this.TILE_EMPTY, this.TILE_FILLED);
        map = this._removeArtifacts(map, threshold, this.TILE_FILLED, this.TILE_EMPTY);
        return map;
    }

    _removeArtifacts(map, threshold, fromTileType, toTileType) {
        const roomDetector = new RoomDetector(fromTileType);
        const rooms = roomDetector.get(map);
        rooms.forEach( room => {
            const roomSize = room.getSize();
            room.getTiles().forEach( tile => {
                if(roomSize >= threshold) return;
                map.set(tile.getX(), tile.getY(), toTileType);
            });
        });
        return map;
    }

    /**
     * @private
     * @param map
     * @param smoothing
     * @return {Matrix}
     */
    _smooth(map, smoothing) {
        for(let smoothingIndex = smoothing; smoothingIndex > 0; smoothingIndex --) {
            map.forEach((map, x, y) => {
                if(x === 0 || x === map.getWidth() -1 || y === 0 || y === map.getHeight() -1) return;
                let surroundingsFilled = map.get(x, y) === this.TILE_FILLED ? -1 : 0;
                for(let i = -1; i <= 1; i++) {
                    for(let j = -1; j <= 1; j++) {
                        const surroundingValue = map.get(x + i, y + j);
                        if(surroundingValue === this.TILE_EMPTY) continue;
                        surroundingsFilled++;
                    }
                }
                if(surroundingsFilled > 4) {
                    map.set(x, y, this.TILE_FILLED);
                } else if (surroundingsFilled < 4) {
                    map.set(x, y, this.TILE_EMPTY);
                }
            })
        }
        return map;
    }
}
