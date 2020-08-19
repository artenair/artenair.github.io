import MinHeap from "../MinHeap";

export default class Graph {

    constructor() {
        this._nodes = {};
        this._edges = {};
        this._size = 0;
    }

    getNodes() {
        return this._nodes;
    }

    getEdges() {
        return this._edges;
    }

    addNode(id, node) {
        this._nodes[id] = {id, node};
        this._edges[id] = new MinHeap([], this.edgeComparator, null);
        this._size++;
    }

    edgeComparator(edge_a, edge_b) {
        return edge_a.weight < edge_b.weight ? -1 : (edge_a.weight > edge_b.weight ? 1 : 0)
    }

    addEdge(id_node_a, id_node_b, weight = 1, additionalInfo = {}) {
        const nodeA = this._nodes[id_node_a];
        const nodeB = this._nodes[id_node_b];
        this._edges[id_node_a].push({origin: nodeA, destination: nodeB, weight, additionalInfo});
        this._edges[id_node_b].push({origin: nodeB, destination: nodeA, weight, additionalInfo});
    }

    getSize() {
        return this._size;
    }

}