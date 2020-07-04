import MazeRunner from "./modules/MazeRunner";
import ElasticBounce from "./modules/ElasticBounce";

const caseStudies = [
    new MazeRunner(),
    new ElasticBounce()
];

caseStudies.forEach( caseStudy => caseStudy.run());
