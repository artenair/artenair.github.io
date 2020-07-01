import p5 from 'p5';
import Maze from "./model/Maze";
import MazeRenderer from "./views/MazeRenderer";
import AStar from "./service/AStar";

let canvas;
let maze;
let mazeRenderer;
let pathFinder;
let path = [];
let mouse;
let cheese;

const sketch = (s) => {

    s.preload= () => {
        mouse = s.loadImage("/dist/images/mouse.png");
        cheese = s.loadImage("/dist/images/cheese.png");
    }

    s.setup = () => {
        const side = Math.min(s.windowWidth, s.windowHeight);
        canvas = s.createCanvas(side, side);
        maze = Maze.make(25,25);
        mazeRenderer = new MazeRenderer(maze, canvas, s);
        const heuristic = (currentCoords, destCoords) => {
            return Math.abs(currentCoords.x - destCoords.x) + Math.abs(currentCoords.y - destCoords.y);
        };

        pathFinder = new AStar(
            maze,
            {x: Math.floor(Math.random() * (maze.getColumns() - 1)), y:Math.floor(Math.random() * (maze.getRows() - 1))},
            {x: Math.floor(Math.random() * (maze.getColumns() - 1)), y:Math.floor(Math.random() * (maze.getRows() - 1))},
            heuristic
        );
        pathFinder.setup();
        pathFinder.run();
        path = pathFinder.getPath();
    }

    s.draw = () => {
        mazeRenderer.render(path, mouse, cheese)
    }
}

const sketchInstance = new p5(sketch);