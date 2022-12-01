
//LINK LIST IMPLEMENTATION GIVEN BY geeksforgeeks.org/implementation-linkedlist-javascript/
class Node {
    // constructor
    constructor(element) {
        this.element = element;
        this.next = null
    }
}
// linkedlist class
class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    // adds an element at the end
    // of list
    add(element) {
        // creates a new node
        var node = new Node(element);

        // to store current node
        var current;

        // if list is Empty add the
        // element and make it head
        if (this.head == null)
            this.head = node;
        else {
            current = this.head;

            // iterate to the end of the
            // list
            while (current.next) {
                current = current.next;
            }

            // add node
            current.next = node;
        }
        this.size++;
    }
    GetNth(index)
    {
        var current = this.head;
        var count = 0;
        /*
         index of Node we are currently looking at
                         */
        while (current != null) {
            if (count == index)
                return current.element;
            count++;
            current = current.next;
        }

        return 0;
    }

}
function tuple3(x, y, z) { return { x: x, y: y, z: z } }
class Target {
    constructor(x,y,z,speed) {
        this.coordinates=tuple3(x,y,z);
        this.speed=speed;
    }
}
window.Target_Manager = window.classes.Target_Manager =
class Target_Manager extends Scene_Component {
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
            target:new Subdivision_Sphere(4),
        }
        this.submit_shapes(context,shapes);
        this.materials={
            phong:  context.get_instance(Phong_Shader).material(Color.of(0.5, 0.5, 0.5, 1), {ambient: 0}),
            target:  context.get_instance(Phong_Shader).material(Color.of(0.25, 1, 0.25, 1), {ambient: 1}),

    };
        this.target_list=new LinkedList();
        this.target_bitmap=[0,0,0];
        this.context.globals.targets = this.target_list;
    }
    make_control_panel() {
        this.key_triggered_button( "Generate Targets",[ "x" ], () =>  this.gen());
        this.new_line();

    }
    gen(){
        this.target_bitmap=[0,0,0];
        this.target_list=new LinkedList();
    }
    draw_targets(graphics_state,t){
        for (let y=0;y<3;y++){
            if(!this.target_bitmap[y]){
                const randx = (Math.random()-.5)*90 ;
                const randy = (Math.random()) *8 +2*y;
                const randz = (Math.random()-2)*20-40 ;
                const rands=(Math.random()+1)*2;
                let targ= new Target(randx,randy,randz,rands);
                let targ_transform=Mat4.identity();
                targ_transform=  targ_transform.times(Mat4.translation([targ.coordinates.x,targ.coordinates.y,targ.coordinates.z]));
                this.target_list.add(targ);
                this.target_bitmap[y]=1;
                console.log(randx,randy,randz);
                this.shapes.target.draw(graphics_state,targ_transform,this.materials.target);
            }else{
                let targ_transform=Mat4.identity();
                this.target_list.GetNth(y).coordinates.x+=0.5*Math.sin(
                    t*Math.PI*2/this.target_list.GetNth(y).speed);
                targ_transform=  targ_transform
                    //.times(Mat4.translation(10*Math.sin(t*Math.PI/5)-5,0,0))
                    .times(Mat4.translation([
                        this.target_list.GetNth(y).coordinates.x,
                        this.target_list.GetNth(y).coordinates.y,
                        this.target_list.GetNth(y).coordinates.z]));
                this.shapes.target.draw(graphics_state,targ_transform,this.materials.target);

            }
        }
    }
    display(graphics_state){
        const t = graphics_state.animation_time / 1000;
        this.draw_targets(graphics_state,t);
        //let targ_transform=Mat4.identity();
        //targ_transform=targ_transform.times(Mat4.translation([-12, 7, -20]));
        //this.shapes.target.draw(graphics_state, targ_transform, this.materials.target);

    }

}