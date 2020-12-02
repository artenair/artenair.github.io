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

        let canvas, bounds, obstacles, population, lifespan;
        let generation = 1, bestGeneration = 0, bestSuccess = 0, lastSuccess = 0;
        const populationSize = 300;

        lifespan = 200;
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

                const obstacleWidth = 0.3;
                const xStartOffset = (1 - obstacleWidth) / 2;
                const xEndOffset = 1 - xStartOffset;
                const yCenterOffset = 30;
                const yCenter = height / 2;

                population = new Population(s.generateStartingPositions(populationSize), target, lifespan);

                obstacles = [
                    new Edge(new Point(width * xStartOffset, yCenter - yCenterOffset), new Point(width *xEndOffset, yCenter - yCenterOffset)),
                    new Edge(new Point(width * xEndOffset, yCenter - yCenterOffset), new Point(width * xEndOffset, yCenter + yCenterOffset)),
                    new Edge(new Point(width * xEndOffset, yCenter + yCenterOffset), new Point(width * xStartOffset, yCenter + yCenterOffset)),
                    new Edge(new Point(width * xStartOffset, yCenter + yCenterOffset), new Point(width *xStartOffset, yCenter - yCenterOffset))
                ];
            }

            s.generateStartingPositions = (populationSize = 100) => {
                const startingPositions = [];
                for(let i = 0; i < populationSize; i++) {
                    startingPositions.push(s.createVector(width / 2, height - 150));
                }
                return startingPositions;
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

                let hasFinished = true;
                let successes = 0;
                let collisions = 0;
                for(let i = 0; i < population.size(); i++) {
                    let rocket = population.get(i);

                    const skeleton = rocket.getSkeleton();

                    if(target.intersectsRectangle(skeleton)) {
                        rocket.setSuccess();
                    }

                    const collided = bounds.reduce( (collided, bound) => {
                        return collided || skeleton.intersectsEdge(bound);
                    }, obstacles.reduce( (collided, obstacle) => {
                        return collided || skeleton.intersectsEdge(obstacle)
                    }, false));

                    rocket.setCollided(collided);

                    s.stroke(255);

                    hasFinished = hasFinished && !rocket.isAlive();

                    if(!rocket.isAlive()) {
                        s.stroke(50);
                    }

                    if(rocket.hasCollided()) {
                        s.stroke(255,0,0);
                        collisions++;
                    }

                    if(rocket.hasSucceeded()) {
                        s.stroke(0,255,0);
                        successes++;
                    }

                    if(i === 0 && generation > 1) {
                        s.stroke(255,0,255);
                    }

                    s.beginShape();
                    for(let vertex of rocket.getSkeleton()) {
                        s.vertex(vertex.getX(), vertex.getY());
                    }
                    s.endShape(s.CLOSE);
                    rocket.move();
                }

                s.noStroke();
                s.fill(255, 25);
                s.rect(25, height - 130, 500 , 120);
                s.fill(255);
                s.textSize(32);
                s.text(`Generation : ${generation}`, 50, height - 88);
                s.textSize(16)
                const successRate = Math.floor(10000 * successes / population.size()) / 100;
                const collisionRate = Math.floor(10000 * collisions / population.size()) / 100;
                s.text(`Success rate : ${successRate}% - Collision rate : ${collisionRate}%`, 50, height - 56);
                s.text(`Best success rate : ${bestSuccess}% in generation ${bestGeneration}`, 50, height - 40);
                s.text(`Last success rate : ${lastSuccess}%`, 50, height - 24);

                if(hasFinished) {
                    const fitnessFunction = (rocket, target) => {
                        const p1 = new Point(
                            rocket.getPosition().x,
                            rocket.getPosition().y,
                        );
                        const p2 = target.getCenter();
                        const maxBase = s.dist(0,0,s.width, s.height);
                        const base = 1 / Math.pow(p1.getDistance(p2), 2);
                        const collisionComponent = 1; //rocket.hasCollided() ? 0.1 : 1;
                        const successComponent = 1; //rocket.hasSucceeded() ? 10 : 1;
                        const ageComponent = 1; //s.map(rocket.getRemainingLife(), 0, lifespan, 0.1, 10);
                        return base * collisionComponent * successComponent * ageComponent;
                    }
                    population.next(fitnessFunction, s.generateStartingPositions(populationSize));
                    if(successRate > bestSuccess) {
                        bestSuccess = successRate;
                        bestGeneration = generation;
                    }
                    lastSuccess = successRate;
                    generation++;
                }
            }
        }
        const sketchInstance = new p5(sketch);
    }
}
