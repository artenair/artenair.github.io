import RocketFactory from "./RocketFactory";
import Rocket from "./Rocket";
import RocketDnaGenerator from "./RocketDnaGenerator";

export default class Population {

    constructor(positions, target, lifespan = 100) {
        this._population = [];
        this._target = target;
        this._lifespan = lifespan;

        for(let position of positions) {
            this._population.push(RocketFactory.random(position, lifespan))
        }
    }

    size() {
        return this._population.length;
    }

    get(index){
        return this._population[index];
    }

    next(fitness, positions) {
        const fitnesses = this._calculateFitnesses(fitness);
        const bestOfGeneration = fitnesses.reduce( (best, candidate) => {
            if(best === null) return candidate;
            return candidate.getFitness() > best.getFitness() ? candidate : best
        }, null).getElement();

        const breedingPool = this._generateBreedingPool(fitnesses);
        const nextGeneration = [new Rocket(positions[0], this._lifespan, bestOfGeneration.getDna())];
        for(let i = 1; i < this._population.length; i++) {
            const {mother, father} = this._findMates(breedingPool);

            const genes = RocketDnaGenerator.crossOver(mother, father);
            nextGeneration.push(
                new Rocket(
                    positions[i],
                    this._lifespan,
                    RocketDnaGenerator.mutate(genes)
                )
            )
        }
        this._population = nextGeneration;
    }

    _findMates(breedingPool) {
        const a = Math.floor(Math.random() * breedingPool.length);
        const b = Math.floor(Math.random() * breedingPool.length);
        return {
            father: breedingPool[a].getDna(),
            mother: breedingPool[b].getDna(),
        }
    }

    _calculateFitnesses(fitness) {
        let totalFitness = 0;
        const fitnesses = this._population.map( rocket => {
            const currentFitness = fitness(rocket, this._target);
            totalFitness += currentFitness;
            return new FitnessElement(
                rocket,
                currentFitness
            )
        });

        fitnesses.forEach( fitness => {
            fitness.setFitness(100 * fitness.getFitness() / totalFitness);
        });

        return fitnesses;
    }

    _generateBreedingPool(fitnesses) {
        const breedingPool = [];
        for(let pair of fitnesses) {
            for(let n  = 0; n < pair.getFitness(); n++) {
                breedingPool.push(pair.getElement());
            }
        }
        return breedingPool;
    }

    [Symbol.iterator]() {
        return this._population.values();
    }

}

export class FitnessElement {

    constructor(element, fitness) {
        this._fitness = fitness;
        this._element = element;
    }

    getElement() {
        return this._element;
    }

    getFitness() {
        return this._fitness;
    }

    setFitness(fitness) {
        this._fitness = fitness;
    }

}