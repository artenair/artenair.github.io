import Vector2 from "../geometry/Vector2";
import Point from "../geometry/Point";

export default class Camera {

    /**
     * @param {Point} position
     * @param {number} facing
     * @param {number} fov
     * @param {number} rays
     * @param {number} radius
     */
    constructor(position, facing = 0, fov = 120, rays= 120, radius = 20) {
        this._position = position;
        this._facing = facing;
        this._fov = fov;
        this._rays = this._generateRays(rays);
        this._radius = radius;
    }

    getRadius() {
        return this._radius;
    }

    setMovementController(movementController) {
        this._movementController = movementController;
    }

    /**
     * @param {QuadMap} bounds
     * @param {callback} searchFunction
     */
    move(bounds = null, searchFunction = null) {
        if(!this._movementController) return;
        this._movementController.move(this, bounds, searchFunction);
    }

    /**
     * @param {Point} position
     */
    setPosition(position) {
        this._position = position
    }

    /**
     * @returns {Point}
     */
    getPosition() {
        return this._position;
    }

    /**
     * @returns {number}
     */
    getFacing() {
        return this._facing
    }

    /**
     * @returns {number}
     */
    getFov() {
        return this._fov;
    }

    /**
     * @returns {Vector2[]}
     */
    getRays() {
        return this._rays;
    }

    /**
     * @param {Point} focus
     * @return {number}
     */
    facePoint(focus) {
        this._facing = this.getPosition().getAngleBetween(focus);
        this._updateRays();
    }


    /**
     * @param {number} speed
     */
    moveForward(speed) {
        const positionVector = this.moveAlongAxis(speed);
        this._position = new Point(positionVector.getXComponent(), positionVector.getYComponent());
    }

    /**
     * @param {number} speed
     */
    moveBackwards(speed) {
        const positionVector = this.moveAlongAxis(-speed);
        this._position = new Point(positionVector.getXComponent(), positionVector.getYComponent());
    }

    /**
     * @param {number} speed
     */
    moveLeft(speed) {
        const positionVector = this.moveAcrossAxis(-speed);
        this._position = new Point(positionVector.getXComponent(), positionVector.getYComponent());
    }

    turnLeft() {
        this._facing -= 1;
        this._updateRays();
    }

    turnRight() {
        this._facing += 1;
        this._updateRays();
    }

    _updateRays() {
        this._rays = this._generateRays(this._rays.length - 1);
    }

    /**
     * @param {number} speed
     */
    moveRight(speed) {
        const positionVector = this.moveAcrossAxis(speed);
        this._position = new Point(positionVector.getXComponent(), positionVector.getYComponent());
    }

    /**
     * @param {number} speed
     */
    moveAlongAxis(speed) {
        const positionVector = new Vector2(this._position.getX(), this._position.getY());
        const movementVector = new Vector2(
            Math.cos(this._facing * Math.PI / 180) * speed,
            Math.sin(this._facing * Math.PI / 180) * speed
        );
        return positionVector.add(movementVector);
    }

    /**
     * @param {number} speed
     */
    moveAcrossAxis(speed) {
        const positionVector = new Vector2(this._position.getX(), this._position.getY());
        const movementVector = new Vector2(
            Math.cos(this._facing * Math.PI / 180) * speed,
            Math.sin(this._facing * Math.PI / 180) * speed
        ).getPerpendicular();
        return positionVector.add(movementVector);
    }

    /**
     * @param cardinality
     * @returns {Vector2[]}
     */
    _generateRays(cardinality) {
        const rays = [];
        const rayAngle = this.getFov() / cardinality;
        const startingAngle = this.getFacing() - this.getFov() / 2;
        for (let i = 0; i <= cardinality; i++) {
            const iterationAngle = (startingAngle + rayAngle * i) * Math.PI / 180;
            rays.push(new Vector2(
                Math.cos(iterationAngle),
                Math.sin(iterationAngle)
            ));
        }
        return rays;
    }
}
