import p5 from "p5";
import Edge from "../geometry/Edge";
import Point from "../geometry/Point";
import Camera from "../service/Camera";
import MeshRenderer from "../views/MeshRenderer";
import MeshGenerator from "../service/MeshGenerator";
import NoiseGenerator from "../service/NoiseGenerator";
import RoomDetector from "../service/CaveExplorer/RoomDetector";
import MapGenerator from "../service/CaveExplorer/MapGenerator";
import RoomConnector from "../service/CaveExplorer/RoomConnector";
import NightModeRayCastingRenderer from "../views/NightModeRayCastingRenderer";
import TurningMovementController from "../controller/TurningMovementController";
import MeshFromMarchingSquares from "../service/MeshGenerator/MeshFromMarchingSquares";

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
        const cameraRadius = .5 * cellSide;

        const boundsCollisionDetection = (circle, segment) => {
            const start = segment.getStart();
            const end = segment.getEnd();
            const squaredRadius = circle.getRadius() * circle.getRadius();
            const intersectsStart = start.getSquaredDistance(circle.getCenter()) < squaredRadius;
            if(intersectsStart) return true;
            const intersectsEnd = end.getSquaredDistance(circle.getCenter()) < squaredRadius;
            if(intersectsEnd) return true;
            const length = segment.getLength();
            const center = circle.getCenter();
            const dotProduct =
                (
                    (center.getX() - start.getX()) * (end.getX() - start.getX()) +
                    (center.getY() - start.getY()) * (end.getY() - start.getY())
                ) / (length * length);
            const closestX = start.getX() + (dotProduct * (end.getX() - start.getX()));
            const closestY = start.getY() + (dotProduct * (end.getY() - start.getY()));
            const closestPoint = new Point(closestX, closestY);
            const epsilon = .01;
            const startEdge = new Edge(start, closestPoint);
            const endEdge = new Edge(end, closestPoint);
            const edgeLengthSum = startEdge.getSquaredLength() + endEdge.getSquaredLength();
            const edgeLength = segment.getSquaredLength();
            const pointIsOnLine = edgeLengthSum >= edgeLength - epsilon && edgeLengthSum <= edgeLength + epsilon;
            if(!pointIsOnLine) return false;
            const connectingEdge = new Edge(closestPoint, center);
            return connectingEdge.getSquaredLength() < circle.getRadius() * circle.getRadius();
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
                roomConnector.connect(map, 3);
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
                camera.setMovementController(new TurningMovementController(s, true))
                cameraRenderer = new NightModeRayCastingRenderer(canvas, cameraBuffer);
            }

            s.draw = () => {
                s.frameRate(30);
                s.image(mapBuffer, 0,0);
                if(camera) {
                    camera.move(bounds, boundsCollisionDetection);
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
