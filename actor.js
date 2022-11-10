
import {defs, tiny} from './examples/common.js';
function tuple3(x, y, z) { return { x: x, y: y, z: z } }
const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;
class Actor{
    constructor(coordinates){
        this.coordinates=coordinates;
    }
};
export class Target extends Actor {
    constructor(x,y,z,speed) {
        super(tuple3(x,y,z));
        this.speed=speed;
    }
};