import Rocket from "./Rocket";
import RocketDnaGenerator from "./RocketDnaGenerator";

export default class RocketFactory {
    static random(position, lifespan = 100) {
        return new Rocket(
            position,
            lifespan,
            RocketDnaGenerator.random(lifespan)
        );
    }
}