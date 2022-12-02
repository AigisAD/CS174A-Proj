class Bullet {

    constructor(pos, dir, time){
        this.pos = pos;
        this.dir = dir;
        this.spawn_time = time
    }
}
window.Aiming_Manager = window.classes.Aiming_Manager = 
class Aiming_Manager extends Scene_Component
{
    /*
        Aiming_Manager is a Scene_Component responsible for rendering the aim cusor and 
        keeping track of the aimed location of the player
        */

        constructor( context, control_box){


            super(context, control_box);
            this.context = context;
            this.canvas = context.canvas;

            const shapes = {
                gun: new Cube(),
                bullet: new Subdivision_Sphere(4),
            }
            this.submit_shapes(context, shapes);
            this.materials = {
                red: context.get_instance(Phong_Shader).material(Color.of(1, 0, 0, 1), {ambient: 1}),
                phong: context.get_instance(Phong_Shader).material(Color.of(0.0, 0.0, 0.0, 1), {ambient: 0.0}),
            };
            this.bullet_size = 1;
            this.bullet_velocity = 500;
            console.log(this.canvas);
            this.target = function() { return context.globals.movement_controls_target() };
            context.globals.movement_controls_target = function(t) { return context.globals.graphics_state.camera_transform };
            //

            this.shoot = this.shoot.bind(this);
            this.live_bullets = [];
            document.addEventListener("mousedown", this.shoot);

            this.music = new Audio("assets/hitmarker.mp3");
            this.music.loop = false;
            this.music.volume = 0.2;

            this.music2 = new Audio("assets/laser.mp3");
            this.music2.loop = false;
            this.music2.speed = 1.5;
            this.music2.volume = 0.2;
         
        }
        
        make_control_panel() {

        }
        checkCollisions(bullet){
            let bullet_pos = Vec.of(bullet.pos[0][3], bullet.pos[1][3], bullet.pos[2][3]);
            let new_array = []
            for (let i = 0; i < this.context.globals.targets.length; i++) {
                let target = this.globals.targets[i];
                let target_pos = Vec.of(target.coordinates["x"], target.coordinates["y"], target.coordinates["z"]);
                var diff = target_pos.minus(bullet_pos);
                var distance = Math.sqrt(diff[0]*diff[0] + diff[1]*diff[1] + diff[2]*diff[2]);
                if (distance <= this.bullet_size + 3){
                    console.log("he;")
                    this.context.globals.totalHits++;
                    this.live_bullets.shift();
                    this.music.play();

                }else{
                    new_array.push(target);
                }

            }
            this.context.globals.targets = new_array;
        }
        drawGun(graphics_state){
            //let transform= Mat4.inverse(this.target());
            let transform= Mat4.inverse(this.target())
                .times(Mat4.scale([1,1,5]))
                .times(Mat4.translation([5,-5,-2.8]));
            //transform=
                //.times(Mat4.scale(1,1,3))

            this.shapes.gun.draw(graphics_state,transform,this.materials.phong);
        }
        shoot(graphics_state) {


        
            console.log("shoot");
            this.context.globals.totalShots++;
            const viewDirection = this.target()[2];
            //extract the 3-dimensional view vector
            const viewVector = Vec.of(viewDirection[0], viewDirection[1], viewDirection[2]);

            //get the current camera position 
            const inverseCameraMatrix = Mat4.inverse(this.target());
            const cameraPosition = Vec.of(inverseCameraMatrix[0][3], inverseCameraMatrix[1][3], inverseCameraMatrix[2][3]);

            //create the transform matrix for the new bullet
            const translationMatrix = Mat4.translation(cameraPosition).times(Mat4.translation([viewDirection[0]*-3, viewDirection[1]*-3, viewDirection[2]*-3]));

            //create the model_transform for the initial position of the new bullet and scale according to BULLET_SIZE
            let bulletTransform = Mat4.identity().times(translationMatrix).times(Mat4.scale([this.bullet_size, this.bullet_size, this.bullet_size]));
            let bullet = new Bullet(bulletTransform, viewVector, this.context.globals.graphics_state.animation_time/1000);
            this.live_bullets.push(bullet);
            this.music2.play();

        }
        updateBulletPos(graphics_state){
            this.live_bullets.map( (bullet) => {
                if( graphics_state.animation_time/1000 - bullet.spawn_time > 1){
                    this.live_bullets.shift();
                    return;
                }
                let dt = graphics_state.animation_delta_time / 1000;
                const bulletDisplacement= -dt * this.bullet_velocity;
                //translate bullet based on elapsed time
                const bulletTransform = bullet.pos.times(Mat4.translation([bullet.dir[0] * bulletDisplacement, bullet.dir[1] * bulletDisplacement, bullet.dir[2] * bulletDisplacement]));
                //update bullet location 
                bullet.pos = bulletTransform;
             })

        }
        display(graphics_state){
            this.drawGun(graphics_state);
            for (let i = 0; i < this.live_bullets.length; i++){
                this.shapes.bullet.draw(graphics_state, this.live_bullets[i].pos, this.materials.red);
                this.checkCollisions(this.live_bullets[i]);
                this.updateBulletPos(graphics_state);
            }

        }
    }