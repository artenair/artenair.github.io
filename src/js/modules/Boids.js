import p5 from "p5";

export default class Boids {
    run() {
        const parent = document.querySelector("#boids");
        if(!parent) return;
        let canvas;
        const width = Math.floor(parent.clientWidth);
        const height = Math.floor(parent.clientHeight);

        const sketch = (s) => {
            s.setup = () => {
                canvas = s.createCanvas(width,height);
                canvas.parent(parent);
            }

            s.draw = () => {
                s.background(50);
                s.fill(70);
            }
        }
        const sketchInstance = new p5(sketch);
    }
}
