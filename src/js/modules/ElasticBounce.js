import p5 from "p5";
import Circle from "../geometry/Circle";
import Rectangle from "../geometry/Rectangle";
import Point from "../geometry/Point";
import QuadMap from "../service/QuadMap";
import Vector2 from "../geometry/Vector2";
import Particle from "../model/Particle";

export default class ElasticBounce {
    run() {
        const parent = document.querySelector("#elasticBounce");
        if(!parent) return;
        const width = Math.floor(parent.clientWidth);
        const height = Math.floor(parent.clientHeight);

        const particles = [];
        const maxFillFactor = 0.6;
        const fillFactor = 0.15;
        const fillArea = width * height;
        let currentFillFactor = 0;
        let canvas;
        let tooLong = false;
        let intersectionCount = 0;
        let minRadius = 5;
        let maxRadius = 25;
        let screen;

        const sketch = (s) => {
            s.setup = () => {
                canvas = s.createCanvas(width,height);
                canvas.parent(parent);
                screen = new Rectangle(0, 0, width, height)

                while(!tooLong && currentFillFactor < Math.min(fillFactor, maxFillFactor)) {
                    const skeleton = Circle.makeRandom(width, height, minRadius, maxRadius);
                    const particle = new Particle(
                        skeleton ,
                        Vector2.random(3,3),
                        skeleton.getArea(),
                        "#000"
                    )

                    let intersect = false;
                    let filledArea = particle.getSkeleton().getArea();

                    particles.forEach( particleInSet => {
                        intersect = intersect || particle.getSkeleton().intersects(particleInSet.getSkeleton());
                        filledArea += particleInSet.getSkeleton().getArea();
                    })

                    if(!intersect) {
                        intersectionCount = 0;
                        particles.push(particle);
                        currentFillFactor = filledArea / fillArea;
                    } else {
                        tooLong = intersectionCount++ > 5
                    }
                }
            }

            s.draw = () => {
                s.background(255);

                const map = new QuadMap(new Point(0, 0), width, height, 4)
                particles.forEach( particle => {
                    particle.setColor("#000");
                    map.add(particle.getSkeleton().getCenter(), particle)
                });

                s.strokeWeight(1);
                s.noFill();
                particles.map(
                    particle => {
                        map.near(particle.getSkeleton().getCenter(), 2 * maxRadius).forEach(
                            nearParticle => {
                                if(nearParticle === particle) return;
                                const newMovement = particle.collides(nearParticle);
                                if(!newMovement) return;
                                particle.setMovement(newMovement);
                            }
                        )
                        particle.update(screen);

                        s.stroke(particle.getColor())
                        s.circle(
                            particle.getSkeleton().getCenter().getX(),
                            particle.getSkeleton().getCenter().getY(),
                            particle.getSkeleton().getDiameter()
                        );
                    }
                )


            }
        }
        const sketchInstance = new p5(sketch);
    }
}
