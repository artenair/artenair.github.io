import Camera from "../service/Camera";

export default class turningMovementController {
    constructor(engine) {
        this._engine = engine;
    }

    /**
     *
     * @param {Camera} camera
     */
    move(camera) {
        if(this._engine.keyIsDown("a".charCodeAt(0)) || this._engine.keyIsDown("A".charCodeAt(0))) {
            camera.turnLeft(3);
        }
        if(this._engine.keyIsDown("d".charCodeAt(0)) || this._engine.keyIsDown("D".charCodeAt(0))) {
            camera.turnRight(3);
        }
        if(this._engine.keyIsDown("w".charCodeAt(0)) || this._engine.keyIsDown("W".charCodeAt(0))) {
            camera.moveForward(5);
        }
        if(this._engine.keyIsDown("s".charCodeAt(0)) || this._engine.keyIsDown("S".charCodeAt(0))) {
            camera.moveBackwards(2);
        }
    }

}
