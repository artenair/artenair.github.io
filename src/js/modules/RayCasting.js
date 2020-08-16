import p5 from "p5";
import Point from "../geometry/Point";
import Edge from "../geometry/Edge";
import Camera from "../service/Camera";
import RayCastingTopDownRenderer from "../views/RayCastingTopDownRenderer";
import RayCastingFake3DRenderer from "../views/RayCastingFake3DRenderer";
import TurningMovementController from "../controller/TurningMovementController";
import StrifingMovementController from "../controller/StrifingMovementController";
import turningMovementController from "../controller/TurningMovementController";

export default class RayCasting {
    run() {
        const parent = document.querySelector("#raycasting");
        if(!parent) return;
        let canvas, turningMovementController, strifingMovementController;
        let computedStyle = window.getComputedStyle(parent);
        const pl = parseFloat(computedStyle.paddingLeft);
        const pr = parseFloat(computedStyle.paddingRight);
        const pt = parseFloat(computedStyle.paddingTop);
        const pb = parseFloat(computedStyle.paddingBottom);

        const width = Math.floor(parent.clientWidth - (pl + pr));
        const height = Math.floor(parent.clientHeight - (pt + pb));

        const bounds = [
            new Edge(new Point(0, 0), new Point(width, 0)),
            new Edge(new Point(width, 0), new Point(width, height)),
            new Edge(new Point(width, height), new Point(0, height)),
            new Edge(new Point(0, height), new Point(0, 0))
        ];

        let boundStart = null;
        let camera = null;
        let rendererTopDown = null;
        let rendererFake3D = null;
        let renderer = null;
        let mode = "TOP_DOWN";

        const sketch = (s) => {
            s.setup = () => {
                canvas = s.createCanvas(width,height);
                canvas.parent(parent);
                turningMovementController = new TurningMovementController(s);
                strifingMovementController = new StrifingMovementController(s);
                camera = new Camera(new Point(width / 2, height / 2 ), 0, 120, 120);
                camera.setMovementController(strifingMovementController);
                rendererTopDown = new RayCastingTopDownRenderer(canvas, s);
                rendererFake3D = new RayCastingFake3DRenderer(canvas, s);
                renderer = rendererTopDown;
            }

            s.mouseClicked = (event) => {
                if(event.target.id === "raycasting") return;
                if(mode !== "TOP_DOWN") return;
                const clickPosition = new Point(event.x - pl, event.y - pt)
                if(!boundStart) {
                    boundStart = clickPosition;
                } else {
                    bounds.push(new Edge(boundStart, clickPosition));
                    boundStart = null;
                }
            }

            s.keyPressed = () => {
                switch(s.keyCode) {
                    case 32: // SPACE
                        switch (mode) {
                            case "TOP_DOWN":
                                mode = "3D";
                                renderer = rendererFake3D;
                                camera.setMovementController(strifingMovementController);
                                break;
                            case "3D":
                                mode = "TOP_DOWN";
                                renderer = rendererTopDown;
                                camera.setMovementController(turningMovementController);
                                break;

                        }
                        break;
                }
            }

            s.draw = () => {
                s.background(30);
                const mousePosition = new Point(s.mouseX, s.mouseY);

                if(boundStart) {
                    s.noStroke();
                    s.fill(255);
                    s.circle(boundStart.getX(), boundStart.getY(), 20);

                    s.stroke(255);
                    s.line(
                        boundStart.getX(),
                        boundStart.getY(),
                        mousePosition.getX(),
                        mousePosition.getY()
                    );

                    s.noStroke();
                    s.fill(255);
                    s.circle(s.mouseX, s.mouseY, 20);
                } else {
                    camera.move();
                }
                s.noStroke();
                renderer.render(camera.getPosition(), camera.getRays(), bounds);
            }
        }
        const sketchInstance = new p5(sketch);
    }
}
