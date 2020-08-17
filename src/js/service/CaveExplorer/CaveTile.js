import Point from "../../geometry/Point";

export default class CaveTile {
    constructor(x, y, type) {
        this._position = new Point(x, y);
        this._type = type;
    }

    getX() {
        return this._position.getX();
    }

    getY() {
        return this._position.getY();
    }

    getPosition() {
        return this._position;
    }

    getType() {
        return this._type
    }

    getAdjacentPositions(withDiagonals = false) {
        const cross = [
            new Point(this.getX(), this.getY()-1),
            new Point(this.getX() + 1, this.getY()),
            new Point(this.getX(), this.getY()+1),
            new Point(this.getX() - 1, this.getY())
        ];
        if (!withDiagonals) return cross;

        const diagonals = [
            new Point(this.getX() - 1, this.getY() - 1),
            new Point(this.getX() - 1, this.getY() + 1),
            new Point(this.getX() + 1, this.getY() -1),
            new Point(this.getX() + 1, this.getY() + 1),
        ];

        return [
            ... cross,
            ... diagonals
        ]
    }

}