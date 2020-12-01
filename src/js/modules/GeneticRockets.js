import p5 from "p5";
import Point from "../geometry/Point";
import Edge from "../geometry/Edge";
import Circle from "../geometry/Circle";
import Population from "../service/GeneticRocket/Population";

export default class GeneticRockets {
    run() {
        const parent = document.querySelector("#geneticRockets");
        if(!parent) return;
        const width = Math.floor(parent.clientWidth);
        const height = Math.floor(parent.clientHeight);

        let canvas, bounds, obstacles, population;

        const target = new Circle(new Point(width / 2, 100), 25);

        const sketch = (s) => {
            s.setup = () => {
                canvas = s.createCanvas(width, height);
                canvas.parent(parent);

                bounds = [
                    new Edge(new Point(0, 0), new Point(width, 0)),
                    new Edge(new Point(width, 0), new Point(width, height)),
                    new Edge(new Point(width, height), new Point(0, height)),
                    new Edge(new Point(0, height), new Point(0, 0)),
                ];

                console.log(bounds);

                const obstacleWidth = 0.6;
                const xStartOffset = (1 - obstacleWidth) / 2;
                const xEndOffset = 1 - xStartOffset;
                const yCenterOffset = 30;

                const startingPositions = [];
                for(let i = 0; i < 1; i++) {
                    startingPositions.push(s.createVector(width / 2, height - 150));
                }
                population = new Population(startingPositions, 200)

                obstacles = [
                    new Edge(new Point(width * xStartOffset, height / 2 - yCenterOffset), new Point(width *xEndOffset, height / 2 - yCenterOffset)),
                    new Edge(new Point(width * xEndOffset, height / 2 - yCenterOffset), new Point(width * xEndOffset, height / 2 + yCenterOffset)),
                    new Edge(new Point(width * xEndOffset, height / 2 + yCenterOffset), new Point(width * xStartOffset, height / 2 + yCenterOffset)),
                    new Edge(new Point(width * xStartOffset, height / 2 + yCenterOffset), new Point(width *xStartOffset, height / 2 - yCenterOffset))
                ];
            }

            s.draw = () => {
                s.background(30);

                const printEdges = (edge) => {
                    s.line(
                        edge.getStart().getX(), edge.getStart().getY(),
                        edge.getEnd().getX(), edge.getEnd().getY(),
                    )
                };

                s.strokeWeight(2);
                s.stroke(30);
                bounds.forEach(printEdges);
                s.stroke(200);
                obstacles.forEach(printEdges);

                s.fill(200);
                s.circle(target.getCenter().getX(), target.getCenter().getY(), 2 * target.getRadius());

                s.noFill();
                for(let rocket of population) {
                    const skeleton = rocket.getSkeleton();
                    const angle = rocket.getVelocity().heading();

                    if(target.intersectsRectangle(skeleton)) {
                        rocket.setSuccess();
                    }

                    const intersectsWithBounds = bounds.reduce( (collided, bound) => {
                        return collided || skeleton.intersectsEdge(bound);
                    }, false);
                    const intersectsWithObstacles = obstacles.reduce( (collided, obstacle) => {
                        return collided || skeleton.intersectsEdge(obstacle)
                    }, false);

                    console.log(intersectsWithBounds, intersectsWithObstacles);
                    rocket.setCollided(
                        intersectsWithBounds || intersectsWithObstacles
                    );



                    s.translate(skeleton.getOrigin().getX(), skeleton.getOrigin().getY());
                    s.rotate(angle);
                    s.rect(0, 0, skeleton.getWidth(), skeleton.getHeight());
                    s.rotate(-angle);
                    s.translate(-skeleton.getOrigin().getX(), -skeleton.getOrigin().getY());
                    rocket.move();
                }
            }
        }
        const sketchInstance = new p5(sketch);
    }
}
