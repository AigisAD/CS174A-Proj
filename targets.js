
// //LINK LIST IMPLEMENTATION GIVEN BY geeksforgeeks.org/implementation-linkedlist-javascript/
// class Node {
//     // constructor
//     constructor(element) {
//         this.element = element;
//         this.next = null
//     }
// }
// // linkedlist class
// class LinkedList {
//     constructor() {
//         this.head = null;
//         this.size = 0;
//     }

//     // adds an element at the end
//     // of list
//     add(element) {
//         // creates a new node
//         var node = new Node(element);

//         // to store current node
//         var current;

//         // if list is Empty add the
//         // element and make it head
//         if (this.head == null)
//             this.head = node;
//         else {
//             current = this.head;

//             // iterate to the end of the
//             // list
//             while (current.next) {
//                 current = current.next;
//             }

//             // add node
//             current.next = node;
//         }
//         this.size++;
//     }
//     GetNth(index)
//     {
//         var current = this.head;
//         var count = 0;
//         /*
//          index of Node we are currently looking at
//                          */
//         while (current != null) {
//             if (count == index)
//                 return current.element;
//             count++;
//             current = current.next;
//         }

//         return 0;
//     }

// }
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
            circle: new Regular_2D_Polygon(2,18)
        }
        this.submit_shapes(context,shapes);
        this.materials={
            phong:  context.get_instance(Phong_Shader).material(Color.of(0.5, 0.5, 0.5, 1), {ambient: 0}),
            target:  context.get_instance(Phong_Shader).material(Color.of(0.25, 1, 0.25, 1), {ambient: 0.5}),
            shadow:context.get_instance(Phong_Shader).material(Color.of(0, 0, 0, 1), {ambient: 1}),

    };
        this.context.globals.targets=[];
        this.targets_at_once=4; //modifiable
        //================================================================ chris wang added start ==============================================
        this.RoundScore = 0;
        this.RoundActive = false;
        this.RoundTargetsLeft = 0;
        this.RoundTargetsMax=20;//modifable
        this.globals.totalShots = 0;
        this.globals.totalHits = 0;
        //================================================================ chris wang added end ==
        this.target_bitmap=new Array(this.targets_at_once).fill(0);
        this.accuracy = document.getElementById("accuracy");
        this.accuracy.textContent="";
        this.score = document.getElementById("score");
        this.score.textContent="";
        this.targetsRem = document.getElementById("targetsLeft");
        this.accuracy.textContent="";
        this.difficulty=0;


    }
    make_control_panel() {
        this.key_triggered_button( "Regenerate Targets",[ "x" ], () =>  this.gen());
        this.key_triggered_button( "Begin round",[ "t" ], () =>  this.StartRound());
        this.key_triggered_button( "Change difficulty",[ "c" ], () =>  this.difficulty=!this.difficulty);
        this.new_line();

    }
    StartRound()
    {
        this.RoundActive = true;
        this.RoundScore = 0;
        this.RoundTargetsLeft = this.RoundTargetsMax;
        this.globals.totalShots = 0;
        this.globals.totalHits = 0;
        this.target_bitmap=new Array(this.targets_at_once).fill(0);
        this.context.globals.targets=[];
    }

    EndRound()
    {
        this.RoundActive = false;
        this.RoundTargetsLeft = 0;
    }
    gen(){
        this.target_bitmap=new Array(this.targets_at_once).fill(0);
        this.context.globals.targets=[];
        for (let i = 0; i < this.targets_at_once; i++){
            const randx = (Math.random()-.5)*90 ;
            const randy = (Math.random()) *8 +2*i;
            const randz = (Math.random()-2)*20-40 ;
            const rands=(Math.random()+1)*2;
            let targ= new Target(randx,randy,randz,rands);
            this.context.globals.targets.push(targ);
        }
    }
    draw_targets(graphics_state,t){
        for (let y=0;y<this.context.globals.targets.length;y++){
            if(!this.target_bitmap[y]){
                let targ_transform=Mat4.identity();
                const randx = (Math.random()-.5)*90 ;
                const randy = (Math.random()) *8 +3*y +10;
                const randz = (Math.random()-2)*20-40 ;
                const rands=(Math.random()+1)*2;
                let targ= new Target(randx,randy,randz,rands);
                this.context.globals.targets.shift();
                this.context.globals.targets.push(targ);
                targ_transform=  targ_transform.times(Mat4.translation([targ.coordinates.x,targ.coordinates.y,targ.coordinates.z]));
                let shadow_trans=targ_transform.times(Mat4.translation([0,(-1*targ.coordinates.y)-3.9,0])).times(Mat4.rotation(Math.PI/2,[1,0,0]));
                this.target_bitmap[y]=1;
                this.shapes.target.draw(graphics_state,targ_transform,this.materials.target);
                this.shapes.circle.draw(graphics_state,shadow_trans,this.materials.shadow);

            }else{
                let targ_transform=Mat4.identity();
                if(this.difficulty==1) {
                    this.context.globals.targets[y].coordinates.x += 0.5 * Math.sin(
                        t * Math.PI * 2 / this.context.globals.targets[y].speed);
                }
                targ_transform=  targ_transform
                    //.times(Mat4.translation(10*Math.sin(t*Math.PI/5)-5,0,0))
                    .times(Mat4.translation([
                        this.context.globals.targets[y].coordinates.x,
                        this.context.globals.targets[y].coordinates.y,
                        this.context.globals.targets[y].coordinates.z]));
                let shadow_trans=targ_transform.times(Mat4.translation([0,(-1*this.context.globals.targets[y].coordinates.y)-3.9,0])).times(Mat4.rotation(Math.PI/2,[1,0,0]));;

                this.shapes.target.draw(graphics_state,targ_transform,this.materials.target);
                this.shapes.circle.draw(graphics_state,shadow_trans,this.materials.shadow);

            }


        }
        if(this.context.globals.targets.length==0){
            this.gen();
        }
    }
    display(graphics_state){
        const t = graphics_state.animation_time / 1000;

        var totalHits = this.globals.totalHits;
        var totalShots = this.globals.totalShots
        var total = totalHits/totalShots;
        var totalM = (totalShots - totalHits);

        this.accuracy.textContent=String(total);

        this.RoundScore=100*this.globals.totalHits;
        if (totalHits != totalShots){
            this.RoundScore-=10*totalM;
        }

        this.score.textContent=this.RoundScore;
        this.RoundTargetsLeft=this.RoundTargetsMax-this.globals.totalHits;
        this.targetsRem.textContent=String(this.RoundTargetsLeft);
        if (this.RoundActive)
        {

            if (this.RoundTargetsLeft > 0)
                this.draw_targets(graphics_state,t);
            //this.gen();

            if (this.RoundTargetsLeft <= 0)
                this.EndRound();
        }
        //let targ_transform=Mat4.identity();
        //targ_transform=targ_transform.times(Mat4.translation([-12, 7, -20]));
        //this.shapes.target.draw(graphics_state, targ_transform, this.materials.target);

    }

}