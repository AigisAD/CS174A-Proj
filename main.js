import {defs, tiny} from './examples/common.js';
import { Target } from './actor.js';
import { Actor_Manager } from './actor_manager.js';

function tuple3(x, y, z) { return { x: x, y: y, z: z } }
const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

export class Main extends Scene {
    constructor() {
        super();
        this.shapes={
            target: new defs.Subdivision_Sphere(4),
        };
        this.materials = {
            target: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#03C04A")}),
        };
        this.target_list=new Actor_Manager();
        this.target_bitmap=[0,0,0];
        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
    }
    draw_targets(context,program_state,t){
        for (let y=0;y<3;y++){
            if(!this.target_bitmap[y]){
                const randx = (Math.random()-.5)*30 ;
                const randy = (Math.random()*-1) *4 -y;
                const randz = (Math.random()-1)*16 ;
                const rands=(Math.random()+1)*2;
                let targ= new Target(randx,randy,randz,rands);
                let targ_transform=Mat4.identity();
                targ_transform=  targ_transform.times(Mat4.translation(targ.coordinates.x,targ.coordinates.y,targ.coordinates.z));
                this.target_list.actor_list.add(targ);
                this.target_bitmap[y]=1;
                console.log(randx);
                this.shapes.target.draw(context,program_state,targ_transform,this.materials.target);
            }else{
                let targ_transform=Mat4.identity();
                this.target_list.actor_list.GetNth(y).coordinates.x+=0.1*Math.sin(
                    t*Math.PI/this.target_list.actor_list.GetNth(y).speed);
                targ_transform=  targ_transform
                    //.times(Mat4.translation(10*Math.sin(t*Math.PI/5)-5,0,0))
                    .times(Mat4.translation(
                    this.target_list.actor_list.GetNth(y).coordinates.x,
                    this.target_list.actor_list.GetNth(y).coordinates.y,
                    this.target_list.actor_list.GetNth(y).coordinates.z));
                this.shapes.target.draw(context,program_state,targ_transform,this.materials.target);
            }
        }
    }
    display(context, program_state) {

        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);


        const light_position = vec4(0, 5, 5, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        const  my_color = hex_color("#ffffff");
        let model_transform = Mat4.identity();
        this.draw_targets(context,program_state,t);
        //this.shapes.cube.draw(context, program_state, model_transform, this.materials.target.override({color: my_color}));

    }

}

