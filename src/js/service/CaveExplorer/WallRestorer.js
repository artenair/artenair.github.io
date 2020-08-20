export default class WallRestorer {

    constructor(wallMarker) {
        this._marker = wallMarker;
    }

    restore(map, radius) {
        map.forEach( (map, x, y) => {
            if(x < radius || x > map.getWidth() - (radius + 1) || y < radius || y > map.getHeight() - (radius + 1)) {
                map.set(x, y, this._marker);
            }
        })
    }

}