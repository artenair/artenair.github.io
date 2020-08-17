export default class NoiseGenerator {

    constructor(engine, seed = null) {
        this._engine = engine;
        this._seed = seed;
        if(this._seed) {
            this._engine.randomSeed(this._seed);
        }
    }

    get(min = 0, max = 1) {
        return this._engine.random(min, max);
    }

}
