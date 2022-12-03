

window.Term_Project_Scene = window.classes.Term_Project_Scene =
    class Term_Project_Scene extends Scene_Component {
        constructor(context, control_box)     // The scene begins by requesting the camera, shapes, and materials it will need.
        {
            super(context, control_box);    // First, include a secondary Scene that provides movement controls:
            if (!context.globals.has_controls)
                context.register_scene_component(new Camera_Movement(context, control_box.parentElement.insertCell()));
                context.register_scene_component(new Aiming_Manager(context, control_box.parentElement.insertCell()));
                context.register_scene_component(new Target_Manager(context, control_box.parentElement.insertCell()));
                context.register_scene_component(new Environment_Manager(context, control_box.parentElement.insertCell()));

            context.globals.graphics_state.camera_transform = Mat4.look_at(Vec.of(0, 25, 0), Vec.of(0, 25, 20), Vec.of(0, 1, 0));

            // *** Mouse controls: ***
            this.mouse = { "from_center": Vec.of( 0,0 ) };                           // Measure mouse steering, for rotating the flyaround camera:
            const mouse_position = ( e, rect = context.canvas.getBoundingClientRect() ) =>
                Vec.of( e.clientX - (rect.left + rect.right)/2, e.clientY - (rect.bottom + rect.top)/2 );
            // Set up mouse response.  The last one stops us from reacting if the mouse leaves the canvas.

            const r = context.width / context.height;
            context.globals.graphics_state.projection_transform = Mat4.perspective(Math.PI / 4, r, .1, 1000);

            const shapes = {
                box: new Cube(),
                axis: new Axis_Arrows(),
                sphere: new Subdivision_Sphere(4),
            };

            this.submit_shapes(context, shapes);

            this.music = new Audio("assets/csgo.mp3");
            this.music.loop = true;
            this.music.volume = 0.1;
            this.context = context;


            this.materials =
                {

                    phong: context.get_instance(Phong_Shader).material(Color.of(50/255,50/255,50/255,1), {ambient: 1}),
                    //phong2: context.get_instance(Phong_Shader).material(Color.of(253/255,250/255,150/255,1), {ambient: 1,}),
                    sky: context.get_instance(Phong_Shader).material(Color.of(0/255,0/255,255/255,1), {ambient: 1,}),
                    //sky2: context.get_instance(Phong_Shader).material(Color.of(0/255,0/255,200/255,1), {ambient: 1,}),
                    //sky3: context.get_instance(Phong_Shader).material(Color.of(0/255,50/255,200/255,1), {ambient: 1,}),
                    yellow: context.get_instance(Phong_Shader).material(Color.of(1, 1, 0, 1), {ambient:1}),
                    sky3: context.get_instance(Phong_Shader).material( Color.of( 0,0,0,1),
                        { ambient: 1, texture: this.context.get_instance( "/assets/sky2.png" ) } ),
                    sky2: context.get_instance(Phong_Shader).material( Color.of( 0,0,0,1),
                        { ambient: 1, texture: this.context.get_instance( "/assets/sky2.png" ) } ),
                    test: context.get_instance(Phong_Shader).material( Color.of( 0,0,0,1),
                        { ambient: 1, texture: context.get_instance( "/assets/test2.jpg" ) } ),
                    phong2: context.get_instance(Phong_Shader).material( Color.of( 0,0,0,1),
                        { ambient: 1, texture: context.get_instance( "/assets/brickedup2.jpg" ) } ),



                };
            this.lights = [new Light(Vec.of(-5, 5, 5, 1), Color.of(0, 1, 1, 1), 100000),new Light(Vec.of(0,-50,72,1), Color.of(0, 1, 1, 1), 100000)];


        }

        make_control_panel() {

        }

        display(graphics_state) {
            graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
            const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

            this.music.play();
            // Drawing map
            var base_map = Mat4.identity().times(Mat4.scale([200, 1, 200]))
                .times(Mat4.translation([0, -5, 0]));
            this.shapes.box.draw(graphics_state, base_map, this.materials.test);

            var wall_1 = Mat4.identity().times(Mat4.translation([0, 20, -200]))
                .times(Mat4.scale([200, 25, 1]));
            var wall_2 = Mat4.identity().times(Mat4.translation([0, 20, 200]))
                .times(Mat4.scale([200, 25, 1]));
            var wall_3 = Mat4.identity().times(Mat4.translation([200, 20, 0]))
                .times(Mat4.scale([1, 25, 200]));
            var wall_4 = Mat4.identity().times(Mat4.translation([-200, 20, 0]))
                .times(Mat4.scale([1, 25, 200]));
            var sphere = Mat4.identity().times(Mat4.translation([0, 100, -72])).times(Mat4.scale([8, 8, 8]));
            this.shapes.box.draw(graphics_state, wall_1, this.materials.phong.override({color: Color.of([0.156, 0, 1, 1])}));
            this.shapes.box.draw(graphics_state, wall_2, this.materials.phong.override({color: Color.of([0.156, 0, 1, 1])}));
            this.shapes.box.draw(graphics_state, wall_3, this.materials.phong.override({color: Color.of([0.156, 0, 1, 1])}));
            this.shapes.box.draw(graphics_state, wall_4, this.materials.phong.override({color: Color.of([0.156, 0, 1, 1])}));
            this.shapes.sphere.draw(graphics_state, sphere, this.materials.phong2);


        }
    }