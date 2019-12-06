class BigSquirmle extends PIXI.Sprite{
    constructor(x = 200, y = 200, direction = "right"){
        super(PIXI.Texture.from('media/squirmleTest.png'));
        this.anchor.set(.5, .5);
        this.x = x;
        this.y = y;
        this.direction = direction;
    }

    bounceX(){
        this.fwd.x *= -1;
    }

    bounceY(){
        this.fwd.y *= -1;
    }
}

class BodySquirmle extends PIXI.Sprite{
    constructor(x = 0, y = 0){

    }

    bounceX(){
        this.fwd.x *= -1;
    }

    bounceY(){
        this.fwd.y *= -1;
    }
}