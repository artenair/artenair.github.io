import Point from "../geometry/Point";
import Camera from "../service/Camera";
import Circle from "../geometry/Circle";

export default class StrifingMovementController {
    constructor(engine, lookAtMouse = true) {
        this._engine = engine;
        this._lookAtMouse = lookAtMouse;
    }

    /**
     * @param {Camera} camera
     * @param {QuadMap} bounds
     * @param {callback} searchFunction
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
            camera.moveLeft(3);
        }
        if(this._engine.keyIsDown("d".charCodeAt(0)) || this._engine.keyIsDown("D".charCodeAt(0))) {
            camera.moveRight(3);
        }
        if(this._engine.keyIsDown("w".charCodeAt(0)) || this._engine.keyIsDown("W".charCodeAt(0))) {
            camera.moveForward(5);
        }
        if(this._engine.keyIsDown("s".charCodeAt(0)) || this._engine.keyIsDown("S".charCodeAt(0))) {
            camera.moveBackwards(2);
        }

        const nearEdges = bounds.near(camera.getPosition(), 2 * camera.getRadius(), searchFunction);
        if(false && nearEdges.length !== 0) {
            nearEdges.forEach( particle => {
                const segment = particle.getSkeleton();
                const distance = segment.getDistanceFromCircle(new Circle(camera.getPosition(), camera.getRadius()));
                if(distance > camera.getRadius()) return;
                camera.setPosition(cachedCameraPosition);
            })
        }
    }
}

