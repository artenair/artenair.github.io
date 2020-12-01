import p5 from "p5";

export default class RocketDnaGenerator {

    static random(length = 100) {
        const dna = [];
        for(let i = 0; i < length; i++) {
            const direction = p5.Vector.random2D();
            direction.setMag(1);
            dna.push(direction);
        }
        return dna;
    }

}