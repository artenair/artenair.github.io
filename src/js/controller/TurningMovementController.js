import Camera from "../service/Camera";
import Point from "../geometry/Point";
import Circle from "../geometry/Circle";

export default class turningMovementController {
    constructor(engine, lookAtMouse = false) {
        this._engine = engine;
        this._lookAtMouse = lookAtMouse;
    }

    /**
     *
     * @param {Camera} camera
     * @param {Edge[]} bounds
     * @param {Function} searchFunction
     */
    move(camera, bounds, searchFunction) {

        const cachedCameraPosition = new Point(
            camera.getPosition().getX(),
            camera.getPosition().getY(),
        );

        if(this._lookAtMouse) {
            const mousePosition = new Point(this._engine.mouseX, this._engine.mouseY);
            camera.facePoint(mousePosition);
        }

        if(this._engine.keyIsDown("a".charCodeAt(0)) || this._engine.keyIsDown("A".charCodeAt(0))) {
            camera.moveLeft(5);
        }
        if(this._engine.keyIsDown("d".charCodeAt(0)) || this._engine.keyIsDown("D".charCodeAt(0))) {
            camera.moveRight(5);
        }
        if(this._engine.keyIsDown("w".charCodeAt(0)) || this._engine.keyIsDown("W".charCodeAt(0))) {
            camera.moveForward(5);
        }
        if(this._engine.keyIsDown("s".charCodeAt(0)) || this._engine.keyIsDown("S".charCodeAt(0))) {
            camera.moveBackwards(5);
        }

        const cameraCircle = new Circle(camera.getPosition(), camera.getRadius());
        const nearEdges = bounds.filter( bound => {
            return searchFunction(cameraCircle, bound);
        })

        if(nearEdges.length !== 0) {
            camera.setPosition(cachedCameraPosition);
        }
    }

}
