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

            console.log(this.canvas);
            this.target = function() { return context.globals.movement_controls_target() }
            context.globals.movement_controls_target = function(t) { return context.globals.graphics_state.camera_transform };
            const shapes={
                gun: new Cube(),
            }
            this.submit_shapes(context, shapes);
            this.materials ={
                phong: context.get_instance(Phong_Shader).material(Color.of(0.0, 0.0, 0.0, 1), {ambient: 0.0}),
            }
         
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
        display(graphics_state){
            //console.log(graphics_state.camera_transform);
            this.drawGun(graphics_state);
            

        }
    }