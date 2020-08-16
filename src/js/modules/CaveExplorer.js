import p5 from "p5";
import MapGenerator from "../service/CaveExplorer/MapGenerator";
import Camera from "../service/Camera";
import Point from "../geometry/Point";
import RayCastingFake3DRenderer from "../views/RayCastingFake3DRenderer";
import Edge from "../geometry/Edge";
import RayCastingTopDownRenderer from "../views/RayCastingTopDownRenderer";
import StrifingMovementController from "../controller/StrifingMovementController";
import NoiseGenerator from "../service/NoiseGenerator";
import TurningMovementController from "../controller/TurningMovementController";

export default class CaveExplorer {
    run() {
        const parent = document.querySelector("#caveExplorer");
        if(!parent) return;
        let canvas, mapGenerator, map, camera, renderer, noiseGenerator;
        const bounds = [];
        const width = Math.floor(parent.clientWidth);
        const height = Math.floor(parent.clientHeight);
        const resolution = 100;
        const fillPercent = .45;
        const minSide = Math.min(width, height);
        const cellSide = Math.max(Math.floor(minSide / resolution), 5);
        const wCells = Math.floor( width / cellSide);
        const hCells = Math.floor( height / cellSide);
        const pl = Math.floor((width - cellSide * wCells) / 2);
        const pt = Math.floor((height - cellSide * hCells) / 2);

        const sketch = (s) => {
            s.setup = () => {
                canvas = s.createCanvas(width,height);
                canvas.parent(parent);
                mapGenerator = new MapGenerator(
                    Math.floor(width / cellSide),
                    Math.floor(height / cellSide),
                    fillPercent
                );
                noiseGenerator = new NoiseGenerator();
                map = mapGenerator.generate(noiseGenerator, 6);
                const TILE_FILLED = mapGenerator.TILE_FILLED;
                const TILE_EMPTY = mapGenerator.TILE_EMPTY;
                map.forEach((map, x, y) => {
                    if(map.get(x, y) === TILE_FILLED) return;
                    if(map.get(x+1, y) === TILE_FILLED) {
                        bounds.push(
                            new Edge(
                                new Point((x+1) * cellSide + pl, y * cellSide + pt),
                                new Point((x+1) * cellSide + pl, (y+1) * cellSide + pt)
                            )
                        )
                    }
                    if(map.get(x-1, y) === TILE_FILLED) {
                        bounds.push(
                            new Edge(
                                new Point(x * cellSide + pl, y * cellSide + pt),
                                new Point(x * cellSide +pl, (y+1) * cellSide + pt)
                            )
                        )
                    }
                    if(map.get(x, y - 1) === TILE_FILLED) {
                        bounds.push(
                            new Edge(
                                new Point(x * cellSide + pl, y * cellSide + pt),
                                new Point( (x+1) * cellSide + pl, y * cellSide + pt)
                            )
                        )
                    }
                    if(map.get(x, y+1) === TILE_FILLED) {
                        bounds.push(
                            new Edge(
                                new Point(x * cellSide + pl, (y+1) * cellSide + pt),
                                new Point((x+1) * cellSide + pl, (y+1) * cellSide + pt)
                            )
                        )
                    }
                });

                let xCamera, yCamera;
                do {
                    xCamera = Math.floor(Math.random() * wCells);
                    yCamera = Math.floor(Math.random() * hCells);
                } while(map.get(xCamera, yCamera) === TILE_FILLED);
                camera = new Camera(
                    new Point(xCamera * cellSide + cellSide / 2, yCamera * cellSide + cellSide / 2),
                    0,
                    45
                );
                camera.setMovementController(new StrifingMovementController(s))
                renderer = new RayCastingTopDownRenderer(canvas, s);
            }

            s.draw = () => {
                s.background(30);
                s.noStroke();
                camera.move();

                s.fill(70);
                s.noStroke();
                map.forEach((map, x, y) => {
                    if(map.get(x, y) === mapGenerator.TILE_EMPTY) return;
                    s.square(
                        x * cellSide + pl,
                        y * cellSide + pt,
                        cellSide
                    )
                });

                renderer.render(camera.getPosition(), camera.getRays(), bounds);
            }
        }
        const sketchInstance = new p5(sketch);
    }
}
