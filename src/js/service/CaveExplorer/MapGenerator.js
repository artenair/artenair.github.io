import Matrix from "../Matrix";

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
     * @return {Matrix}
     */
    generate(noiseGenerator, smoothing= 0) {
        const map = new Matrix(this.width, this.height, 1);
        map.forEach((map, x, y) => {
            if(x === 0 || x === map.getWidth() -1 || y === 0 || y === map.getHeight() -1) {
                map.set(x, y, this.TILE_FILLED);
                return;
            }
            map.set(x, y, noiseGenerator.get() <= this.fillPercent ? this.TILE_FILLED : this.TILE_EMPTY);
        });
        return this._smooth(map, smoothing);
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
