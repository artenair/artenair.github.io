import MazeRunner from "./modules/MazeRunner";
import ElasticBounce from "./modules/ElasticBounce";
import RayCasting from "./modules/RayCasting";
import CaveExplorer from "./modules/CaveExplorer";
import SpanningTree from "./modules/SpanningTree";
import Boids from "./modules/Boids";
import GeneticRockets from "./modules/GeneticRockets";

const caseStudies = [
    new MazeRunner(),
    new ElasticBounce(),
    new RayCasting(),
    new CaveExplorer(),
    new SpanningTree(),
    new GeneticRockets(),
    new Boids()
];

caseStudies.forEach(caseStudy => caseStudy.run());
