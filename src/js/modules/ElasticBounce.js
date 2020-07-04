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
        const clickRadius = Math.floor(Math.max(width, height) / 5);
        const minClickAcceleration = 2;
        const maxClickAcceleration = 5;
        const clickQueue = [];

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
                    } else {
                        tooLong = intersectionCount++ > 5
                    }
                }
            }

            s.mouseClicked = (event) => {
                clickQueue.push(new Point(s.mouseX, s.mouseY));
            }

            s.draw = () => {
                s.background(30);
                const map = new QuadMap(new Point(0, 0), width, height, 4);
                particles.forEach( particle => {
                    map.add(particle.getSkeleton().getCenter(), particle)
                });

                const click = clickQueue.shift();

                if(click) {
                    map.near(click, clickRadius).map(
                        particle => {
                            const cX = particle.getSkeleton().getCenter().getX();
                            const cY = particle.getSkeleton().getCenter().getY();
                            const dX = cX - click.getX();
                            const dY = cY - click.getY()

                            const acceleration = new Vector2(
                                s.map(Math.abs(dX) / particle.getMass(), 0, clickRadius, minClickAcceleration, maxClickAcceleration) * dX / Math.abs(dX),
                                s.map(Math.abs(dY) / particle.getMass(), 0, clickRadius, minClickAcceleration, maxClickAcceleration) * dY / Math.abs(dY)
                            )

                            particle.setMovement(
                                particle.getMovement().add(acceleration)
                            )

                        }
                    )
                }

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
