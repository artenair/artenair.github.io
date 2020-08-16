import MazeRunner from "./modules/MazeRunner";
import ElasticBounce from "./modules/ElasticBounce";
import RayCasting from "./modules/RayCasting";
import CaveExplorer from "./modules/CaveExplorer";

const caseStudies = [
    new MazeRunner(),
    new ElasticBounce(),
    new RayCasting(),
    new CaveExplorer()
];

caseStudies.forEach(caseStudy => caseStudy.run());
