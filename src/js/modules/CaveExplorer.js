import p5 from "p5";
import MapGenerator from "../service/CaveExplorer/MapGenerator";
import Camera from "../service/Camera";
import Point from "../geometry/Point";
import StrifingMovementController from "../controller/StrifingMovementController";
import NoiseGenerator from "../service/NoiseGenerator";
import MeshGenerator from "../service/MeshGenerator";
import MeshFromMarchingSquares from "../service/MeshGenerator/MeshFromMarchingSquares";
import MeshRenderer from "../views/MeshRenderer";
import RoomConnector from "../service/CaveExplorer/RoomConnector";
import NightModeRayCastingRenderer from "../views/NightModeRayCastingRenderer";
import QuadMap from "../service/QuadMap";
import Particle from "../model/Particle";
import Rectangle from "../geometry/Rectangle";
import Edge from "../geometry/Edge";
import Circle from "../geometry/Circle";
import RoomDetector from "../service/CaveExplorer/RoomDetector";

export default class CaveExplorer {
    run() {
        const parent = document.querySelector("#caveExplorer");
        if(!parent) return;
        let canvas, mapBuffer, cameraBuffer, mapGenerator, map, camera, renderer, cameraRenderer;
        let noiseGenerator, mesh, rooms;
        const meshStrategy = new MeshFromMarchingSquares();
        const meshGenerator = new MeshGenerator();
        let bounds = [];
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
        const cameraRadius = .75 * cellSide;
        const boundsMap = new QuadMap(
            new Point(0,0),
            width,
            height,
            4
        );
        const boundsSearchFunction = (circle, particleSegment) => {
            const segment = particleSegment.getSkeleton();
            const intersectionExists = segment.getDistanceFromCircle(circle) <= circle.getRadius();
            const internalIntersection = segment.getCenter().getDistance(circle.getCenter()) <= circle.getRadius();
            return intersectionExists || internalIntersection;
        }


        const sketch = (s) => {
            s.setup = () => {
                canvas = s.createCanvas(width,height);
                canvas.parent(parent);
                mapBuffer = s.createGraphics(width, height);
                mapBuffer.background(30);
                mapBuffer.fill(70);
                cameraBuffer = s.createGraphics(width, height);

                renderer = new MeshRenderer(canvas, mapBuffer, pl, pt);
                mapGenerator = new MapGenerator(
                    Math.floor(width / cellSide) + 1,
                    Math.floor(height / cellSide) + 1,
                    fillPercent
                );
                noiseGenerator = new NoiseGenerator(s, 45);
                map = mapGenerator.generate(noiseGenerator, smoothing);
                const roomConnector = new RoomConnector(mapGenerator.TILE_EMPTY);
                const roomDetector = new RoomDetector(mapGenerator.TILE_EMPTY);
                rooms = roomDetector.get(map);
                roomConnector.connect(map, 1);
                meshStrategy.setSide(cellSide).setSource(map);
                meshGenerator.setStrategy(meshStrategy);
                mesh = meshGenerator.generate();
                meshStrategy
                    .getExternalEdges()
                    .forEach( edge => {
                        bounds.push(edge);
                    });
                renderer.render(mesh, bounds);
                renderer.render(mesh);
                bounds.forEach( bound => {
                    boundsMap.add(bound.getCenter(), new Particle(bound))
                });

                const randomRoomIndex = Math.floor(Math.random() * rooms.length);
                const cameraStartingPosition = rooms[randomRoomIndex].getMathematicalCenter();
                const scaledCameraPosition = new Point(
                    (cameraStartingPosition.getX() + 1 ) * cellSide,
                    (cameraStartingPosition.getY() + 1) * cellSide,
                );

                camera = new Camera(
                    scaledCameraPosition,
                    0,
                    120,
                    120,
                    cameraRadius
                );
                camera.setMovementController(new StrifingMovementController(s))
                cameraRenderer = new NightModeRayCastingRenderer(canvas, cameraBuffer);
            }

            s.draw = () => {
                s.frameRate(30);
                s.image(mapBuffer, 0,0);
                if(camera) {
                    camera.move(boundsMap, boundsSearchFunction);
                    cameraRenderer.render(
                        camera.getPosition(),
                        camera.getRays(),
                        camera.getRadius(),
                        bounds);
                    s.image(cameraBuffer, 0, 0);
                }
            }
        }
        const sketchInstance = new p5(sketch);
    }
}
