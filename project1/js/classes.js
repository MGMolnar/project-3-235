class BodySquirmle extends PIXI.Sprite{
    constructor(x = -210, y = -210, rotation = Math.PI/2, texture = "media/squirmleTest.png"){
        super(PIXI.Texture.from(texture));
        this.anchor.set(.5, .5);
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
        this.rotation = rotation;
        this.prevRotation = rotation;
        this.imageRotation = rotation;
        this.movement = false;
    }
}

class Node { 
    // constructor 
    constructor(element) { 
        this.element = element; 
        this.next = null;
        this.prev = null;
        this.x = element.x;
        this.y = element.y;
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
        if(this.size != 2){
            this.tail = this.tail.prev;
            this.tail.next = null;
    
            this.size--;
        }
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

class Food extends PIXI.Sprite{
    constructor(x = 0, y = 0){
        super(PIXI.Texture.from("media/eyes.png"));
        //this.beginFill(color);
        //this.drawRect(-4, -4, 12, 12);
        //this.endFill();
        this.x = parseInt(Math.random() * 500);
        this.y = parseInt(Math.random() * 500);
    }
}

class EnemySquirmle extends PIXI.Sprite{
    constructor(x = -10, y = -10){
        super(PIXI.Texture.from("media/enemySquirmle.png"));
        //this.beginFill(color);
        //this.drawRect(-2, -2, 18, 18);
        //this.endFill();
        this.anchor.set(.5, .5);
        this.x = x;
        this.y = y;

    }
}

class BabySquirmle extends PIXI.Sprite{
    constructor(x, y){
        super(PIXI.Texture.from("media/baby.png"));
        //this.beginFill(color);
        //this.drawRect(0, 0, 18, 18);
        //this.endFill();
        this.x = x;
        this.y = y;
    }
}

