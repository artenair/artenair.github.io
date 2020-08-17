import MinimumSpanningTree from "./MinimumSpanningTree";
import Graph from "./Graph";
import MinHeap from "../MinHeap";

export default class Prim extends MinimumSpanningTree{

    /**
     * @param graph
     * @returns {Graph}
     */
    get(graph) {
        const spanningTree = new Graph();
        if(graph.getNodes().length === 0) return spanningTree;
        const firstElement = Object.keys(graph.getNodes())[0];
        const {id, node} = graph.getNodes()[firstElement];
        const graphEdges = graph.getEdges();

        const edges = new MinHeap(graphEdges[id].getDataAsArray(), graph.edgeComparator);
        let insertedLookup = {};
        spanningTree.addNode(id, node);
        insertedLookup[id] = true;

        while(spanningTree.getSize() < graph.getSize()) {
            const edge = edges.pop();
            const {origin, destination, weight} = edge;
            if(insertedLookup[origin.id] &&  insertedLookup[destination.id]) continue;
            if(!insertedLookup[origin.id] &&  !insertedLookup[destination.id]) continue;
            if(!insertedLookup[origin.id]) {
                insertedLookup[origin.id] = true;
                spanningTree.addNode(origin.id, origin.node);
                graphEdges[origin.id].getDataAsArray().forEach( (edge) => { edges.push(edge) });
            }
            if(!insertedLookup[destination.id]) {
                insertedLookup[destination.id] = true;
                spanningTree.addNode(destination.id, destination.node);
                graphEdges[destination.id].getDataAsArray().forEach( (edge) => { edges.push(edge) });
            }
            spanningTree.addEdge(origin.id, destination.id, weight);
        }
        return spanningTree;
    }

    edgeComparator(edge_a, edge_b) {
        return edge_a.weight < edge_b.weight ? -1 : (edge_a.weight > edge_b.weight ? 1 : 0)
    }

}
