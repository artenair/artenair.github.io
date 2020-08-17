import Mesh from "../Mesh";

export default class MeshGeneratorInterface {

    /**
     * @return {Mesh}
     */
    generate() {
        return new Mesh()
    }
}
