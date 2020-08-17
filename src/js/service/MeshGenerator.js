import MeshGeneratorInterface from "./MeshGenerator/MeshGeneratorInterface";

export default class MeshGenerator {

    /**
     * @param {MeshGeneratorInterface} strategy
     */
    constructor(strategy = null) {
        this._strategy = strategy;
    }

    /**
     * @param {MeshGeneratorInterface} strategy
     */
    setStrategy(strategy) {
        this._strategy = strategy;
    }

    /**
     * @return {Mesh}
     */
    generate() {
        if(!this._strategy) return null;
        return this._strategy.generate();
    }


}
