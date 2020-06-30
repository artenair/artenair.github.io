import p5 from 'p5';
import Maze from "./model/Maze";
import MazeRenderer from "./views/MazeRenderer";
import AStar from "./service/AStar";

let canvas;
let maze;
let mazeRenderer;
let pathFinder;
let path = [];

const sketch = (s) => {
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
            {x: 0, y:0},
            {x: maze.getColumns() - 1, y: maze.getRows() -1},
            heuristic
        );
        pathFinder.setup();
        pathFinder.run();
        path = pathFinder.getPath();

    }

    s.draw = () => {
        mazeRenderer.render(path)
    }
}

const sketchInstance = new p5(sketch);