import RocketFactory from "./RocketFactory";

export default class Population {

    constructor(positions) {
        this._population = [];
        for(let position of positions) {
            this._population.push(RocketFactory.random(position))
        }
    }

}