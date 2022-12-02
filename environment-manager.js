const NUM_PARTS = 30;
const MAP_BOUNDS = 200;

function tuple3(x, y, z) { return { x: x, y: y, z: z } }
class Obstacle {
    constructor(x,y,z,sx,sy,sz) {
        this.coordinates=tuple3(x,y,z);
        this.xSize=sx;
        this.ySize=sy;
        this.zSize=sz;
    }
}
window.Environment_Manager = window.classes.Environment_Manager =
    class Environment_Manager extends Scene_Component {
        constructor(context,control_box) {
            super(context, control_box);
            this.context = context;
            this.canvas = context.canvas;
            this.target = function () {
                return context.globals.movement_controls_target()
            }
            context.globals.movement_controls_target = function (t) {
                return context.globals.graphics_state.camera_transform
            };
            const mapBound = 90;
            const shapes={
                box: new Cube(),
            }
            this.submit_shapes(context,shapes);
            this.materials={
                phong:  context.get_instance(Phong_Shader).material(Color.of(1, 1, 1, 1), {ambient: 0}),
                box:  context.get_instance(Phong_Shader).material(Color.of(1, 1, 1, 1), {ambient: 0}),

            };
            this.obstacle_list=new LinkedList();
            this.obstacle_bitmap=[0,0,0];
        }
        make_control_panel() {
            this.key_triggered_button( "Generate Obstacles",[ "b" ], () =>  this.gen());
            this.new_line();

        }

        getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
        }

        gen(){
            this.obstacle_bitmap=[0,0,0];
            this.obstacle_list=new LinkedList();
        }
        draw_obstacles(graphics_state,t){
            for (let y=0;y<NUM_PARTS;y++){
                if(!this.obstacle_bitmap[y]){
                    const scalex = this.getRandomInt(1,16) ;
                    const scaley = this.getRandomInt(1,16) ;
                    const scalez = this.getRandomInt(1,16) ;
                    const randx = (Math.random()-.5)*MAP_BOUNDS*1.3 ;
                    const randy = (0);
                    const randz = (Math.random()-.5)*MAP_BOUNDS*1.2 ;





                    let targ= new Obstacle(randx,randy,randz,scalex,scaley,scalez);
                    let targ_transform=Mat4.identity();

                    targ_transform=  targ_transform.times(Mat4.translation([targ.coordinates.x,targ.coordinates.y,targ.coordinates.z]));

                    this.obstacle_list.add(targ);
                    this.obstacle_bitmap[y]=1;
                    console.log(randx,randy,randz);
                    this.shapes.box.draw(graphics_state,targ_transform,this.materials.box);
                }else{

                    let targ_transform=Mat4.identity();

                    targ_transform=  targ_transform
                        .times(Mat4.translation([
                            this.obstacle_list.GetNth(y).coordinates.x,
                            this.obstacle_list.GetNth(y).coordinates.y,
                            this.obstacle_list.GetNth(y).coordinates.z]));

                     targ_transform=  targ_transform
                         .times(Mat4.scale([
                             this.obstacle_list.GetNth(y).xSize,
                             this.obstacle_list.GetNth(y).ySize,
                             this.obstacle_list.GetNth(y).zSize]));



                    this.shapes.box.draw(graphics_state,targ_transform,this.materials.box);

                }
            }
        }
        display(graphics_state){
            super.display(graphics_state);
            const t = graphics_state.animation_time / 1000;
            let model_transform = Mat4.identity();

            model_transform = model_transform.times(Mat4.scale(1,4,1));

            model_transform = this.draw_obstacles(graphics_state,t);
            //let targ_transform=Mat4.identity();
            //targ_transform=targ_transform.times(Mat4.translation([-12, 7, -20]));
            //this.shapes.target.draw(graphics_state, targ_transform, this.materials.target);

        }

    }