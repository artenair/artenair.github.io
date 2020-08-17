import MazeRunner from "./modules/MazeRunner";
import ElasticBounce from "./modules/ElasticBounce";
import RayCasting from "./modules/RayCasting";
import CaveExplorer from "./modules/CaveExplorer";
import SpanningTree from "./modules/SpanningTree";

const caseStudies = [
    new MazeRunner(),
    new ElasticBounce(),
    new RayCasting(),
    new CaveExplorer(),
    new SpanningTree()
];

caseStudies.forEach(caseStudy => caseStudy.run());
