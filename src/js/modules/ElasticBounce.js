import p5 from "p5";
import Circle from "../geometry/Circle";
import Rectangle from "../geometry/Rectangle";
import Point from "../geometry/Point";
import QuadMap from "../service/QuadMap";
import Vector2 from "../geometry/Vector2";
import Particle from "../model/Particle";
import AcceleratingParticle from "../model/AcceleratingParticle";

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
        const gravity = new Vector2(0, 2);
        const energyConservation = 0.5;

        const sketch = (s) => {
            s.setup = () => {
                canvas = s.createCanvas(width,height);
                canvas.parent(parent);
                screen = new Rectangle(0, 0, width, height);

                while(!tooLong && currentFillFactor < Math.min(fillFactor, maxFillFactor)) {
                    const skeleton = Circle.makeRandom(width, height, minRadius, maxRadius);
                    const red = Math.floor(Math.random() * 255);
                    const green = Math.floor(Math.random() * 255);
                    const blue = Math.floor(Math.random() * 255);

                    const particle = new Particle(
                        skeleton ,
                        Vector2.random(3, 5),
                        skeleton.getArea(),
                        `rgb(${red},${green},${blue})`
                    );

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
                        // tooLong = true;
                    } else {
                        tooLong = intersectionCount++ > 5
                    }
                }
            }

            s.draw = () => {
                s.background(30);

                const map = new QuadMap(new Point(0, 0), width, height)
                particles.forEach( particle => {
                    map.add(particle.getSkeleton().getCenter(), particle)
                });

                particles.map(
                    particle => {
                        if(!(particle instanceof AcceleratingParticle)) {
                            map.near(particle.getSkeleton().getCenter(), 2 * maxRadius).forEach(
                                nearParticle => {
                                    if(nearParticle === particle) return;
                                    particle.collides(nearParticle);
                                }
                            )
                        }
                        particle.update(screen);

                        s.noStroke();
                        s.fill(particle.getColor());
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
