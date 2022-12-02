const NUM_PARTS = 30;
const MAP_BOUNDS = 200;

function tuple3(x, y, z) { return { x: x, y: y, z: z } }
class Obstacle {
    constructor(x,y,z,sx,sy,sz) {
        this.coordinates=tuple3(x,y,z);
        this.xSize = sx;
        this.ySize = sy;
        this.zSize = sz;
    }
}
window.Environment_Manager = window.classes.Environment_Manager =
    class Environment_Manager extends Scene_Component {
        constructor(context, control_box) {
            super(context, control_box);
            this.context = context;
            this.canvas = context.canvas;
            this.target = function () {
                return context.globals.movement_controls_target()
            }
            context.globals.movement_controls_target = function (t) {
                return context.globals.graphics_state.camera_transform
            };

            const shapes = {
                box: new Cube(),
            }
            this.submit_shapes(context, shapes);
            this.materials = {
                phong: context.get_instance(Phong_Shader).material(Color.of(1, 1, 1, 1), {ambient: 0}),
                box: context.get_instance(Phong_Shader).material(Color.of(1, 1, 1, 1), {ambient: 0}),

            };
            this.context.globals.obstacles = [];
            this.obstacle_bitmap = new Array(30).fill(0);

        }

        make_control_panel() {
            this.key_triggered_button("Generate Obstacles", ["b"], () => this.genObstacles());
            this.new_line();

        }

        getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
        }

        genObstacles() {
            this.obstacle_bitmap = new Array(30).fill(0);
            this.context.globals.obstacles = [];
            for (let i = 0; i < NUM_PARTS; i++) {
                const scalex = this.getRandomInt(4, 16);
                const scaley = this.getRandomInt(4, 16);
                const scalez = this.getRandomInt(4, 16);

                const randx = (Math.random() - .5) * MAP_BOUNDS * 1.3;
                const randy = (0);
                const randz = (Math.random() - .5) * MAP_BOUNDS * 1.2;

                let obst = new Obstacle(randx, randy, randz, scalex, scaley, scalez);

                this.context.globals.obstacles.push(obst);
            }
        }

        draw_obstacles(graphics_state, t) {
            for (let y = 0; y < NUM_PARTS; y++) {
                if (!this.obstacle_bitmap[y]) {
                    let obst_transform = Mat4.identity();
                    const scalex = this.getRandomInt(4, 16);
                    const scaley = this.getRandomInt(4, 16);
                    const scalez = this.getRandomInt(4, 16);

                    const randx = (Math.random() - .5) * MAP_BOUNDS * 1.3;
                    const randy = (0);
                    const randz = (Math.random() - .5) * MAP_BOUNDS * 1.2;

                    let obst = new Obstacle(randx, randy, randz, scalex, scaley, scalez);

                    this.context.globals.obstacles.push(obst);

                    obst_transform = obst_transform.times(Mat4.translation([obst.coordinates.x, obst.coordinates.y, obst.coordinates.z]));
                    this.obstacle_bitmap[y] = 1;
                    this.shapes.box.draw(graphics_state, obst_transform, this.materials.box);

                } else {

                    let obst_transform = Mat4.identity();

                    obst_transform = obst_transform
                        .times(Mat4.translation([
                            this.context.globals.obstacles[y].coordinates.x,
                            this.context.globals.obstacles[y].coordinates.y,
                            this.context.globals.obstacles[y].coordinates.z]));

                    obst_transform = obst_transform
                        .times(Mat4.scale([
                            this.context.globals.obstacles[y].xSize,
                            this.context.globals.obstacles[y].ySize,
                            this.context.globals.obstacles[y].zSize,]));


                    this.shapes.box.draw(graphics_state, obst_transform, this.materials.box);


                }
            }
        }


        display(graphics_state) {
            const t = graphics_state.animation_time / 1000;
            this.draw_obstacles(graphics_state,t);

        }
    }