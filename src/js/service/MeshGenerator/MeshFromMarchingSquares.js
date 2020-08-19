import Matrix from "../Matrix";
import MeshGeneratorInterface from "./MeshGeneratorInterface";
import Mesh from "../Mesh";
import Point from "../../geometry/Point";
import ControlNode from "../CaveExplorer/ControlNode";
import MarchingSquare from "../CaveExplorer/MarchingSquare";
import Triangle from "../Mesh/Polygon";

export default class MeshFromMarchingSquares extends MeshGeneratorInterface{

    /**
     * @param {Matrix} source
     * @param {number} side
     */
    constructor(source = null, side = null) {
        super();
        this._source = source;
        this._side = side;
        this._externalEdges = [];
        this._squares = [];
    }

    /**
     * @return {object[]}
     */
    getExternalEdges() {
        if(!this._externalEdges) {
            this.generate();
        }
        return this._externalEdges;
    }

    /**
     * @param {Matrix} source
     * @return {MeshFromMarchingSquares}
     */
    setSource(source) {
        this._source = source;
        return this;
    }

    getSquares() {
        return this._squares;
    }

    /**
     * @param {number} side
     * @return {MeshFromMarchingSquares}
     */
    setSide(side) {
        this._side = side;
        return this;
    }

    /**
     *
     */
    generate() {
        const columns = this._source.getWidth();
        const rows = this._source.getHeight();
        const controlNodes = new Matrix(columns, rows);
        const squares = new Matrix(columns - 1, rows - 1);

        controlNodes.forEach((source, x, y) => {
            const nodePosition = new Point( x * this._side, y * this._side  );
            source.set(x, y, new ControlNode(
                nodePosition,
                this._side,
                !!this._source.get(x, y)
            ))
        });

        const polygons = [];
        squares.forEach( (source, x, y) => {
            const marchingSquare = new MarchingSquare(
                controlNodes.get(x, y),
                controlNodes.get(x + 1, y),
                controlNodes.get(x + 1, y + 1),
                controlNodes.get(x, y + 1)
            );
            squares.set(x, y,marchingSquare);
            const polygon = marchingSquare.getPolygon();
            if(!polygon) return;
            polygons.push(polygon);
            marchingSquare.getExternalBounds().forEach(edge => {
                this._externalEdges.push(edge);
            });
        });
        this._squares = squares;
        return new Mesh(polygons);
    }

}
