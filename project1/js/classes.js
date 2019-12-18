class BodySquirmle extends PIXI.Sprite{
    constructor(x = -210, y = -210, rotation = Math.PI/2, texture = "media/squirmleBody.png"){
        super(PIXI.Texture.from(texture));
        this.anchor.set(.5, .5);
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
        this.rotation = rotation;
        this.prevRotation = rotation;
        // This doesn't actually rotate anything, it's basically a temporary variable
        // that's useful for the tail
        this.imageRotation = rotation; 
    }
}

class Node { 
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
    add(element) { 
        let node = new Node(element);

        if(this.head == null){ // Add head if empty
            this.head = node;
            this.tail = node;
        }
        else { // Add node 
            node.prev = this.tail;
            this.tail.next = node;
            this.tail = node;
        }
        this.size++; 
    } 
    poop(){
        // Restrict pooping if all that is left is the head and tail
        if(this.size != 2){
            this.tail = this.tail.prev;
            this.tail.next = null;
    
            this.size--;
        }
    }
}

class Food extends PIXI.Sprite{
    constructor(x = 0, y = 0){
        super(PIXI.Texture.from("media/eyes.png"));
        this.anchor.set(.5, .5);
        this.x = Math.round(parseInt(Math.random() * 30)) * 20 + 10;
        this.y = Math.round(parseInt(Math.random() * 30)) * 20 + 10;
    }
}

class EnemySquirmle extends PIXI.Sprite{
    constructor(x = -10, y = -10){
        super(PIXI.Texture.from("media/enemySquirmle.png"));
        this.anchor.set(.5, .5);
        this.x = x;
        this.y = y;
    }
}

class BabySquirmle extends PIXI.Sprite{
    constructor(x, y){
        super(PIXI.Texture.from("media/baby.png"));
        this.anchor.set(.5, .5);
        this.x = x;
        this.y = y;
    }
}

