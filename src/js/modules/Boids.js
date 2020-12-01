import p5 from "p5";
import Boid from "../model/Boid";
import Point from "../geometry/Point";
import Rectangle from "../geometry/Rectangle";
import QuadMap from "../service/QuadMap";
import Vector2 from "../geometry/Vector2";

export default class Boids {
    run() {
        const parent = document.querySelector("#boids");
        if(!parent) return;
        let canvas;
        const width = Math.floor(parent.clientWidth);
        const height = Math.floor(parent.clientHeight);
        const boids = [];
        const personalSpace = 200;

        const sketch = (s) => {
            s.setup = () => {
                canvas = s.createCanvas(width,height);
                canvas.parent(parent);
                for(let i = 0; i < 50; i++) {
                    boids.push(new Boid(
                        new Vector2(
                            Math.random() * s.width,
                            Math.random() * s.height
                        ),
                        2 * Math.PI * Math.random(),
                        5 * Math.random() + 7,
                        3,
                        2 * Math.random() + 3,
                        true,
                        new Rectangle(0,0, s.width, s.height)
                    ));
                }
            }

            s.draw = () => {
                s.background(50);
                s.fill(255);

                const quadTree = new QuadMap(new Point(0,0), s.width, s.height, 4);
                boids.forEach( boid => quadTree.add(boid.getPosition().asPoint(), boid));

                for(let boid of boids) {

                    const neighbours = quadTree.near(
                        boid.getPosition().asPoint(),
                        personalSpace,
                        (searchCircle, boid) => {
                            const circleCenter = searchCircle.getCenter();
                            const boidSkeleton = boid.getSkeleton();
                            const nearestVertex = boidSkeleton.getNearestVertexTo(circleCenter);
                            return nearestVertex.getDistance(circleCenter) <= searchCircle.getRadius();
                        }
                    );
                    boid.flock(neighbours).move();
                    s.circle(boid.getPosition().getX(),boid.getPosition().getY(), boid.getRadius());
                    /**
                    s.beginShape();
                    for(let vertex of boid.getSkeleton()) {
                        s.vertex(vertex.getX(), vertex.getY());
                    }
                    s.endShape(s.CLOSE);
                    */
                }
            }
        }
        const sketchInstance = new p5(sketch);
    }
}
