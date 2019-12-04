class BigSquirmel extends PIXI.Sprite{
    constructor(x = 0, y = 0){
        //super(PIXI.loader.resources[/*images of big squirmel*/].texture);
        this.anchor.set(.5, .5);
        this.x = x;
        this.y = y;
    }

    bounceX(){
        this.fwd.x *= -1;
    }

    bounceY(){
        this.fwd.y *= -1;
    }
}

class BodySquirmel extends PIXI.Sprite{
    constructor(x = 0, y = 0){

    }

    bounceX(){
        this.fwd.x *= -1;
    }

    bounceY(){
        this.fwd.y *= -1;
    }
}