import RocketFactory from "./RocketFactory";

export default class Population {

    constructor(positions, lifespan = 100) {
        this._population = [];
        for(let position of positions) {
            this._population.push(RocketFactory.random(position, lifespan))
        }
    }

    [Symbol.iterator]() {
        return this._population.values();
    }

}