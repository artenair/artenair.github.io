export default class NoiseGenerator {
    get(min = 0, max = 1) {
        return min + (Math.random() * (max - min));
    }

}
