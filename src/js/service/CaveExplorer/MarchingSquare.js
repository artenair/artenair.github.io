import ControlNode from "./ControlNode"
import Polygon from "../Mesh/Polygon";
import Edge from "../../geometry/Edge";


export default class MarchingSquare {

    /**
     * @param {ControlNode} tl Top left corner
     * @param {ControlNode} tr Top right corner
     * @param {ControlNode} br Bottom right corner
     * @param {ControlNode} bl Bottom left corner
     */
    constructor(tl, tr, br, bl) {
        this._topLeft = tl;
        this._topRight = tr;
        this._bottomLeft = bl;
        this._bottomRight = br;

        this._configuration = this._topLeft.isActive() ? 8 : 0;
        this._configuration += this._topRight.isActive() ? 4 : 0;
        this._configuration += this._bottomRight.isActive() ? 2 : 0;
        this._configuration += this._bottomLeft.isActive() ? 1 : 0;

        this._top = this._topLeft.getRight();
        this._right = this._topRight.getBottom();
        this._bottom = this._bottomLeft.getRight();
        this._left = this._topLeft.getBottom();
    }

    /**
     * @return {ControlNode}
     */
    getTopLeft() {
        return this._topLeft;
    }

    /**
     * @return {ControlNode}
     */
    getTopRight() {
        return this._topRight;
    }

    /**
     * @return {ControlNode}
     */
    getBottomRight() {
        return this._bottomRight;
    }

    /**
     * @return {ControlNode}
     */
    getBottomLeft() {
        return this._bottomLeft;
    }

    /**
     * @return {Node}
     */
    getTop() {
        return this._top;
    }

    /**
     * @return {Node}
     */
    getRight() {
        return this._right;
    }

    /**
     * @return {Node}
     */
    getBottom() {
        return this._bottom;
    }

    /**
     * @return {Node}
     */
    getLeft() {
        return this._left;
    }

    getConfiguration() {
        return this._configuration;
    }

    /**
     * return {Polygon[]}
     */
    getPolygon() {
        switch (this.getConfiguration()) {
            case 0:
                return null

            // One point active configuration
            case 1:
                return new Polygon(
                    this._bottom.getPosition(),
                    this._bottomLeft.getPosition(),
                    this._left.getPosition()
                );
            case 2:
                return new Polygon(
                    this._right.getPosition(),
                    this._bottomRight.getPosition(),
                    this._bottom.getPosition()
                );
            case 4:
                return new Polygon(
                    this._top.getPosition(),
                    this._topRight.getPosition(),
                    this._right.getPosition()
                );
            case 8:
                return new Polygon(
                    this._topLeft.getPosition(),
                    this._top.getPosition(),
                    this._left.getPosition()
                );

            case 3:
                return new Polygon(
                    this._right.getPosition(),
                    this._bottomRight.getPosition(),
                    this._bottomLeft.getPosition(),
                    this._left.getPosition()
                );

            case 6:
                return new Polygon(
                    this._top.getPosition(),
                    this._topRight.getPosition(),
                    this._bottomRight.getPosition(),
                    this._bottom.getPosition()
                );

            case 9:
                return new Polygon(
                    this._topLeft.getPosition(),
                    this._top.getPosition(),
                    this._bottom.getPosition(),
                    this._bottomLeft.getPosition()
                );

            case 12:
                return new Polygon(
                    this._topLeft.getPosition(),
                    this._topRight.getPosition(),
                    this._right.getPosition(),
                    this._left.getPosition()
                );

            case 5:
                return new Polygon(
                    this._top.getPosition(),
                    this._topRight.getPosition(),
                    this._right.getPosition(),
                    this._bottom.getPosition(),
                    this._bottomLeft.getPosition(),
                    this._left.getPosition()
                );

            case 10:
                return new Polygon(
                    this._topLeft.getPosition(),
                    this._top.getPosition(),
                    this._right.getPosition(),
                    this._bottomRight.getPosition(),
                    this._bottom.getPosition(),
                    this._left.getPosition()
                );

            // Three point cases
            case 7:
                return new Polygon(
                    this._top.getPosition(),
                    this._topRight.getPosition(),
                    this._bottomRight.getPosition(),
                    this._bottomLeft.getPosition(),
                    this._left.getPosition()
                );

            case 11:
                return new Polygon(
                    this._top.getPosition(),
                    this._right.getPosition(),
                    this._bottomRight.getPosition(),
                    this._bottomLeft.getPosition(),
                    this._topLeft.getPosition()
                );

            case 13:
                return new Polygon(
                    this._topLeft.getPosition(),
                    this._topRight.getPosition(),
                    this._right.getPosition(),
                    this._bottom.getPosition(),
                    this._bottomLeft.getPosition(),
                );

            case 14:
                return new Polygon(
                    this._topLeft.getPosition(),
                    this._topRight.getPosition(),
                    this._bottomRight.getPosition(),
                    this._bottom.getPosition(),
                    this._left.getPosition(),
                );

            case 15:
                return new Polygon(
                    this._topLeft.getPosition(),
                    this._topRight.getPosition(),
                    this._bottomRight.getPosition(),
                    this._bottomLeft.getPosition()
                );

            default:
                return null;
        }
    }


    /**
     * return {Edge[]}
     */
    getExternalBounds() {
        switch (this.getConfiguration()) {
            case 0:
                return [];

            // One point active configuration
            case 1:
                return [
                    new Edge(this._left.getPosition(), this._bottom.getPosition())
                ];
            case 2:
                return [
                    new Edge(this._bottom.getPosition(), this._right.getPosition())
                ];
            case 4:
                return [
                    new Edge(this._right.getPosition(), this._top.getPosition())
                ];
            case 8:
                return [
                    new Edge(this._top.getPosition(), this._left.getPosition())
                ];

            case 3:
                return [
                    new Edge(this._left.getPosition(), this._right.getPosition())
                ];

            case 6:
                return [
                    new Edge(this._top.getPosition(), this._bottom.getPosition())
                ];

            case 9:
                return [
                    new Edge(this._top.getPosition(), this._bottom.getPosition())
                ];

            case 12:
                return [
                    new Edge(this._left.getPosition(), this._right.getPosition())
                ];

            case 5:
                return [
                    new Edge(this._left.getPosition(), this._top.getPosition()),
                    new Edge(this._bottom.getPosition(), this._right.getPosition())
                ];

            case 10:
                return [
                    new Edge(this._left.getPosition(), this._bottom.getPosition()),
                    new Edge(this._right.getPosition(), this._top.getPosition())
                ];

            // Three point cases
            case 7:
                return [
                    new Edge(this._left.getPosition(), this._top.getPosition()),
                ];

            case 11:
                return [
                    new Edge(this._top.getPosition(), this._right.getPosition())
                ];

            case 13:
                return [
                    new Edge(this._bottom.getPosition(), this._right.getPosition())
                ];

            case 14:
                return [
                    new Edge(this._bottom.getPosition(), this._left.getPosition())
                ];

            case 15:
                return [];

            default:
                return [];
        }
    }

}
