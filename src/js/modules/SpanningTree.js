import p5 from "p5";
import Point from "../geometry/Point";
import NoiseGenerator from "../service/NoiseGenerator";
import Graph from "../service/Graph/Graph";
import Prim from "../service/Graph/Prim";

export default class CaveExplorer {
    run() {
        const parent = document.querySelector("#spanningTree");
        if(!parent) return;
        let canvas;
        const width = Math.floor(parent.clientWidth);
        const height = Math.floor(parent.clientHeight);
        const graph = new Graph();
        let spanningTree;

        const sketch = (s) => {
            s.setup = () => {
                canvas = s.createCanvas(width,height);
                canvas.parent(parent);
                const noiseGenerator = new NoiseGenerator(s);
                for(let i=0; i < 13; i ++) {
                    graph.addNode(i, new Point(
                        noiseGenerator.get(50, width - 50),
                        noiseGenerator.get(50, height - 50)
                    ));
                }

                let nodesLookup = {};
                const nodes = graph.getNodes();
                for(let origin_id in nodes) {
                    if (!nodes.hasOwnProperty(origin_id)) continue;
                    const origin_node = nodes[origin_id].node;
                    for(let destination_id in nodes) {
                        if (!nodes.hasOwnProperty(destination_id)) continue;
                        const destination_node = nodes[destination_id].node;
                        if(origin_node === destination_node) continue;
                        if(nodesLookup[`${origin_id}_${destination_id}`]) continue;
                        graph.addEdge(origin_id, destination_id, origin_node.getDistance(destination_node));
                        nodesLookup[`${origin_id}_${destination_id}`] = true;
                        nodesLookup[`${destination_id}_${origin_id}`] = true;
                    }
                }

                const spanningTreeGenerator = new Prim();
                spanningTree = spanningTreeGenerator.get(graph);
            }

            s.graphRenderer = (graph, nodeColor, edgeColor) => {
                s.strokeWeight(2);
                s.stroke(edgeColor);
                const edges = graph.getEdges();
                for(let originId in edges) {
                    if (!edges.hasOwnProperty(originId)) continue;
                    edges[originId].getDataAsArray().forEach( ({origin, destination, weight}) => {
                        s.line(origin.node.getX(), origin.node.getY(), destination.node.getX(), destination.node.getY());
                    })
                }

                s.noStroke();
                s.fill(nodeColor);
                const nodes = graph.getNodes();
                for(let nodeId in nodes) {
                    if(!nodes.hasOwnProperty(nodeId)) continue;
                    const node = nodes[nodeId].node;
                    s.circle(node.getX(), node.getY(), 50)
                }
            }

            s.draw = () => {
                s.background(50);
                s.fill(70);
                s.graphRenderer(graph, 200, 125);
                s.graphRenderer(spanningTree, "red", "red");
            }
        }
        const sketchInstance = new p5(sketch);
    }
}
