
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

    // insert element at the position index
    // of the list
    insertAt(element, index) {
        if (index < 0 || index > this.size)
            return console.log("Please enter a valid index.");
        else {
            // creates a new node
            var node = new Node(element);
            var curr, prev;

            curr = this.head;

            // add the element to the
            // first index
            if (index == 0) {
                node.next = this.head;
                this.head = node;
            } else {
                curr = this.head;
                var it = 0;

                // iterate over the list to find
                // the position to insert
                while (it < index) {
                    it++;
                    prev = curr;
                    curr = curr.next;
                }

                // adding an element
                node.next = curr;
                prev.next = node;
            }
            this.size++;
        }
    }

    // removes an element from the
    // specified location
    removeFrom(index) {
        if (index < 0 || index >= this.size)
            return console.log("Please Enter a valid index");
        else {
            var curr, prev, it = 0;
            curr = this.head;
            prev = curr;

            // deleting first element
            if (index === 0) {
                this.head = curr.next;
            } else {
                // iterate over the list to the
                // position to removce an element
                while (it < index) {
                    it++;
                    prev = curr;
                    curr = curr.next;
                }

                // remove the element
                prev.next = curr.next;
            }
            this.size--;

            // return the remove element
            return curr.element;
        }
    }

    // removes a given element from the
    // list
    removeElement(element) {
        var current = this.head;
        var prev = null;

        // iterate over the list
        while (current != null) {
            // comparing element with current
            // element if found then remove the
            // and return true
            if (current.element === element) {
                if (prev == null) {
                    this.head = current.next;
                } else {
                    prev.next = current.next;
                }
                this.size--;
                return current.element;
            }
            prev = current;
            current = current.next;
        }
        return -1;
    }


    // finds the index of element
    indexOf(element) {
        var count = 0;
        var current = this.head;

        // iterate over the list
        while (current != null) {
            // compare each element of the list
            // with given element
            if (current.element === element)
                return count;
            count++;
            current = current.next;
        }

        // not found
        return -1;
    }

    // checks the list for empty
    isEmpty() {
        return this.size == 0;
    }

    // gives the size of the list
    size_of_list() {
        console.log(this.size);
    }


    // prints the list items
    printList() {
        var curr = this.head;
        var str = "";
        while (curr) {
            str += curr.element + " ";
            curr = curr.next;
        }
        console.log(str);
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
        this.shapes={
            target:new Subdivision_Sphere(4),
        }
        this.materials={
            phong: context.get_instance(Phong_Shader).material(Color.of(0.25, 0.8, 0.1, 1), {ambient: 0})
        };
        this.target_list=new LinkedList();
        this.target_bitmap=[0,0,0];
    }
    make_control_panel() {
        this.key_triggered_button( "Generate Targets",[ "x" ], () =>  this.gen());
        this.new_line();

    }
    gen(){
        this.target_bitmap=[0,0,0];
    }
    draw_targets(graphics_state,t){
        for (let y=0;y<3;y++){
            if(!this.target_bitmap[y]){
                const randx = (Math.random()-.5)*30 ;
                const randy = (Math.random()*-1) *4 -y;
                const randz = (Math.random()-1)*16 ;
                const rands=(Math.random()+1)*2;
                let targ= new Target(randx,randy,randz,rands);
                let targ_transform=Mat4.identity();
                targ_transform=  targ_transform.times(Mat4.translation(targ.coordinates.x,targ.coordinates.y,targ.coordinates.z));
                this.target_list.add(targ);
                this.target_bitmap[y]=1;
                console.log(randx);
                this.shapes.target.draw(graphics_state,targ_transform,this.materials.target);
            }else{
                let targ_transform=Mat4.identity();
                this.target_list.GetNth(y).coordinates.x+=0.1*Math.sin(
                    t*Math.PI/this.target_list.GetNth(y).speed);
                targ_transform=  targ_transform
                    //.times(Mat4.translation(10*Math.sin(t*Math.PI/5)-5,0,0))
                    .times(Mat4.translation(
                        this.target_list.GetNth(y).coordinates.x,
                        this.target_list.GetNth(y).coordinates.y,
                        this.target_list.GetNth(y).coordinates.z));
                this.shapes.target.draw(graphics_state,targ_transform,this.materials.target);
            }
        }
    }
    display(graphics_state){
        const t = graphics_state.animation_time / 1000;
        this.draw_targets(graphics_state,t);

    }

}
