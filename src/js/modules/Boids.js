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
        const personalSpace = 100;
        const populationSize = 150;

        const sketch = (s) => {
            s.setup = () => {
                canvas = s.createCanvas(width,height);
                canvas.parent(parent);
                for(let i = 0; i < populationSize; i++) {
                    boids.push(new Boid(
                        new p5.Vector(
                            Math.random() * s.width,
                            Math.random() * s.height
                        ),
                        2 * Math.PI * Math.random(),
                        10,
                        3,
                        5,
                        true,
                        new Rectangle(0,0, s.width, s.height)
                    ));
                }
            }

            s.draw = () => {
                s.background(50);


                const quadTree = new QuadMap(new Point(0,0), s.width, s.height, 4);
                boids.forEach( boid => {
                    const {x,y} = boid.getPosition();
                    quadTree.add( new Point(x, y), boid)
                });

                for(let boid of boids) {
                    const {x,y} = boid.getPosition();
                    const neighbours = quadTree.near(
                        new Point(x, y),
                        personalSpace,
                        (searchCircle, boid) => {
                            const circleCenter = searchCircle.getCenter();
                            const boidSkeleton = boid.getSkeleton();
                            const nearestVertex = boidSkeleton.getClosestCornerTo(circleCenter);
                            return nearestVertex.getDistance(circleCenter) <= searchCircle.getRadius();
                        }
                    );

                    boid
                        .flock(neighbours)
                        .move();

                    s.noFill();
                    s.strokeWeight(1);
                    s.stroke(255,150);
                    s.beginShape();
                    for(let vertex of boid.getSkeleton()) {
                        s.vertex(vertex.getX(), vertex.getY());
                    }
                    s.endShape(s.CLOSE);
                }
            }
        }
        const sketchInstance = new p5(sketch);
    }
}
