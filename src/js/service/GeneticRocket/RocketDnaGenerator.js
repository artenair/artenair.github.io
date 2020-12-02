import p5 from "p5";

export default class RocketDnaGenerator {

    static random(length = 100) {
        const dna = [];
        for(let i = 0; i < length; i++) {
            dna.push(RocketDnaGenerator.generateRandomGene());
        }
        return dna;
    }

    static generateRandomGene() {
        const gene = p5.Vector.random2D();
        gene.setMag(1);
        return gene;
    }

    static crossOver(first, second) {
        const dna = [];

        const shortest = first.length < second.length ? first : second;
        const longest = first.length >= second.length ? first : second;

        for(let i = 0; i < shortest.length; i++) {
            dna.push(
                Math.random() >= 0.5 ? shortest[i] : longest[i]
            );
        }
        for(let i = shortest.length; i < longest.length; i++) {
            dna.push(longest[i]);
        }
        return dna;
    }

    static mutate(dna) {
        return dna.map( gene => {
            return Math.random() < 0.01 ? RocketDnaGenerator.generateRandomGene() : gene;
        })
    }

}