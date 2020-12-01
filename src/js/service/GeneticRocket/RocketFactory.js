import Rocket from "./Rocket";
import {vector, createVector} from "p5";

export default class RocketFactory {

    static random(position, lifespan = 100) {
        return new Rocket(position, lifespan)
    }
}