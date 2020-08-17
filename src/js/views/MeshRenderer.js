import PassageDirection, {Direction} from "../model/PassageDirection";
import Edge from "../geometry/Edge";
import Point from "../geometry/Point";

export default class MeshRenderer {

    constructor(canvas, engine, pl = 0, pt = 0) {
        this._canvas = canvas;
        this._engine = engine;
        this._pl = pl;
        this._pt = pt;
    }

    /**
     * @param {Mesh} mesh
     */
    render(mesh) {
        this._engine.noStroke();
        mesh.reset();
        while(mesh.hasMore()) {
            const polygon = mesh.next();
            this._engine.push();
            this._engine.beginShape();
            polygon.getVertices().forEach( vertex => {
                this._engine.vertex(vertex.getX() + this._pl, vertex.getY() + this._pt);
            })
            this._engine.endShape(this._engine.CLOSE);
            this._engine.pop();
        }
    }
}
