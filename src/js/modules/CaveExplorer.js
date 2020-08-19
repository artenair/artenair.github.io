import p5 from "p5";
import MapGenerator from "../service/CaveExplorer/MapGenerator";
import Camera from "../service/Camera";
import Point from "../geometry/Point";
import Edge from "../geometry/Edge";
import RayCastingTopDownRenderer from "../views/RayCastingTopDownRenderer";
import StrifingMovementController from "../controller/StrifingMovementController";
import NoiseGenerator from "../service/NoiseGenerator";
import MeshGenerator from "../service/MeshGenerator";
import MeshFromMarchingSquares from "../service/MeshGenerator/MeshFromMarchingSquares";
import MeshRenderer from "../views/MeshRenderer";
import RoomConnector from "../service/CaveExplorer/RoomConnector";
import RoomDetector from "../service/CaveExplorer/RoomDetector";

export default class CaveExplorer {
    run() {
        const parent = document.querySelector("#caveExplorer");
        if(!parent) return;
        let canvas, mapGenerator, map, camera, renderer, cameraRenderer;
        let noiseGenerator, mesh, graphConnections, roomDetector;
        const meshStrategy = new MeshFromMarchingSquares();
        const meshGenerator = new MeshGenerator();
        const bounds = [];
        const width = Math.floor(parent.clientWidth);
        const height = Math.floor(parent.clientHeight);
        const resolution = 100;
        const fillPercent = .5;
        const smoothing = 4;
        const minSide = Math.min(width, height);
        const cellSide = Math.max(Math.floor(minSide / resolution), 5);
        const wCells = Math.floor( width / cellSide);
        const hCells = Math.floor( height / cellSide);
        const pl = Math.floor((width - cellSide * wCells) / 2);
        const pt = Math.floor((height - cellSide * hCells) / 2);
        let rooms = null;
        let passages = null;

        const sketch = (s) => {
            s.setup = () => {
                canvas = s.createCanvas(width,height);
                renderer = new MeshRenderer(canvas, s, pl, pt);
                canvas.parent(parent);
                mapGenerator = new MapGenerator(
                    Math.floor(width / cellSide) + 1,
                    Math.floor(height / cellSide) + 1,
                    fillPercent
                );
                noiseGenerator = new NoiseGenerator(s, 45);
                map = mapGenerator.generate(noiseGenerator, smoothing);
                roomDetector = new RoomDetector(mapGenerator.TILE_EMPTY);
                rooms = roomDetector.get(map);

                const roomConnector = new RoomConnector(mapGenerator.TILE_EMPTY);
                graphConnections = roomConnector.connect(map);

                meshStrategy.setSide(cellSide).setSource(map);
                meshGenerator.setStrategy(meshStrategy);
                mesh = meshGenerator.generate();
                meshStrategy
                    .getPolygonsWithConfiguration()
                    .map( ({polygon, configuration}) => {
                        if(configuration === 15) return null;
                        return polygon;
                    })
                    .filter( polygon => !!polygon )
                    .map( polygon => {
                        const vertices = polygon.getVertices();
                        for(let i = 1; i < vertices.length; i++) {
                            bounds.push(new Edge(vertices[i - 1], vertices[i]));
                        }
                        bounds.push(new Edge(
                            vertices[vertices.length - 1],
                            vertices[0],
                        ))
                    });


                /*
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
                cameraRenderer = new RayCastingTopDownRenderer(canvas, s, false);
                 */

            }

            s.draw = () => {
                s.background(30);
                s.fill(70);
                renderer.render(mesh);

                /**
                s.strokeWeight(1);
                s.stroke(255,255,255);
                map.forEach( (source, x, y) => {
                    const value = source.get(x, y);
                    const color = (value === 0) ? 255 : (value === 1 ?  0 : "red");
                    s.fill(color);
                    s.square(
                        pl + x * cellSide,
                        pt + y * cellSide,
                        cellSide
                    );
                });

                const colors = ["blue"];

                rooms.map( (room, roomIndex) => {
                    const tl = room.getTopLeft();
                    const bl = room.getBottomRight();
                    const center = room.getCenter();
                    const centerMultiplier = 0.7;
                    const ap = (cellSide - (cellSide * centerMultiplier)) / 2;
                    const color = colors[roomIndex % colors.length];

                    s.noFill();
                    s.strokeWeight(1);
                    s.stroke(color);
                    s.rect(
                        pl + tl.getX() * cellSide,
                        pt + tl.getY() * cellSide,
                        (bl.getX() - tl.getX() + 1) * cellSide,
                        (bl.getY() - tl.getY() + 1) * cellSide
                    );

                    s.noStroke()
                    s.fill(color);
                    s.square(
                        ap + pl + center.getX() * cellSide,
                        ap + pt + center.getY() * cellSide,
                        cellSide * centerMultiplier
                    )
                });
                 */

                s.graphRenderer(graphConnections, "red", "red");

                if(camera) {
                    camera.move();
                    cameraRenderer.render(camera.getPosition(), camera.getRays(), bounds);
                }
            }

            s.graphRenderer = (graph, nodeColor, edgeColor) => {
                s.strokeWeight(2);
                s.stroke(edgeColor);
                const edges = graph.getEdges();
                for(let originId in edges) {
                    if (!edges.hasOwnProperty(originId)) continue;
                    edges[originId].getDataAsArray().forEach( ({origin, destination, additionalInfo}) => {
                        const originCenter = new Point(
                            additionalInfo.origin.getX(),
                            additionalInfo.origin.getY()
                        );
                        const destinationCenter = new Point(
                            additionalInfo.destination.getX(),
                            additionalInfo.destination.getY()
                        );

                        s.line(
                            pl + originCenter.getX() * cellSide,
                            pt + originCenter.getY() * cellSide,
                            pl + destinationCenter.getX() * cellSide,
                            pt + destinationCenter.getY()  * cellSide
                        );
                    })
                }
            }
        }
        const sketchInstance = new p5(sketch);
    }
}
