import Node from "./Node";
import Point from "../../geometry/Point";

export default class ControlNode extends Node{

    /**
     * @param {Point} position
     * @param {number} radius
     * @param {boolean} active
     * @param {number} weight
     */
    constructor(position, radius, active= true, weight = 1) {
        super(position);
        this._active = active;
        this._weight = weight;
        this._bottom = new Node(new Point(position.getX(),  position.getY() + radius / 2));
        this._right = new Node(new Point(position.getX() + radius / 2, position.getY()));
    }

    /**
     * @return {Node}
     */
    getBottom() {
        return this._bottom;
    }

    /**
     * @param {Node} node
     * @return {ControlNode}
     */
    setBottom(node) {
        this._bottom = node;
        return this;
    }

    /**
     * @return {Node}
     */
    getRight() {
        return this._right;
    }

    /**
     * @param {Node} node
     * @return {ControlNode}
     */
    setRight(node) {
        this._right = node;
        return this;
    }

    /**
     * @return {boolean}
     */
    isActive() {
        return this._active;
    }



}
