import Rectangle from "../../geometry/Rectangle";
import Point from "../../geometry/Point";

export default class Rocket {

    constructor(position, lifespan, dna) {
        this._position = position;
        this._skeleton = new Rectangle(
            new Point(position.x - 5, position.y - 5),
            new Point(position.x + 5, position.y + 5)
        );
        this._lifespan = lifespan;
        this._dna = dna;
    }

    getSkeleton() {
        return this._skeleton;
    }

}