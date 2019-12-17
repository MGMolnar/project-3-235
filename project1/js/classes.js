class BodySquirmle extends PIXI.Sprite{
    constructor(x = 200, y = 200, rotation = Math.PI/2, texture = "media/squirmleTest.png"){
        super(PIXI.Texture.from(texture));
        this.anchor.set(.5, .5);
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
        this.rotation = rotation;
        this.prevRotation = rotation;
        this.imageRotation = rotation;
    }
}

class Node { 
    // constructor 
    constructor(element) { 
        this.element = element; 
        this.next = null;
        this.prev = null;
    } 
} 

class LinkedList { 
    constructor() { 
        this.head = null; 
        this.tail = null;
        this.size = 0; 
    } 
  
    // functions to be implemented 
    // add(element) 
    add(element) { 
        let node = new Node(element);

        // Add head if empty
        if(this.head == null){
            this.head = node;
            this.tail = node;
        }
        // Add node 
        else {
            node.prev = this.tail;
            this.tail.next = node;
            this.tail = node;
        }
        this.size++; 
    } 
    poop(){
        this.tail = this.tail.prev;
        this.tail.next = null;

        this.size--;
    }
    
    // Helper Methods 
    // isEmpty 
    // size_Of_List 
    // PrintList 
    printList() 
    { 
        let curr = this.head; 
        let str = ""; 
        while (curr) { 
            str += curr.element + " "; 
            curr = curr.next; 
        } 
        console.log(str); 
    }
}

class Food extends PIXI.Graphics{
    constructor(x = 0, y = 0, color = 0xFFFFFF){
        super();
        this.beginFill(color);
        this.drawRect(-2, -2, 4, 6);
        this.endFill();
        this.x = parseInt(Math.random() * 500);
        this.y = parseInt(Math.random() * 500);
    }
}

class EnemySquirmle extends PIXI.Graphics{
    constructor(x = 250, y = 250, color = 0x00FF00){
        super();
        this.beginFill(color);
        this.drawRect(-2, -2, 6, 6);
        this.endFill();
        this.x = parseInt(Math.random() * 500);
        this.y = parseInt(Math.random() * 500);

    }
}

