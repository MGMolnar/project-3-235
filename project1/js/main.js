"use strict";

const app = new PIXI.Application(600,600);
document.body.appendChild(app.view);

PIXI.loader.
add('media/squirmleTest.png');

let titleScreen;
let endScreen;
let gameScreen;
let controlScreen;
let bigSquirmle;
let stage;
let keys = {};
let keysDiv;
let food;

let b = new Bump(PIXI);

let foodSpawned = [];
let squirmleList;

window.addEventListener("keydown", keysDown);
window.addEventListener("keyup", keysUp);

createPages();

//used to create the four different scenes in the scene.
function createPages(){
    
    stage = app.stage;

    //creates the titleScreen and adds it to the stage
    titleScreen = new PIXI.Container();
    stage.addChild(titleScreen);

    gameScreen = new PIXI.Container();
    gameScreen.visible = false;
    stage.addChild(gameScreen);

    bigSquirmle = new BigSquirmle();
    gameScreen.addChild(bigSquirmle);
    squirmleList = new LinkedList();
    squirmleList.add(new BodySquirmle());
    squirmleList.add(new BodySquirmle(180));
    squirmleList.add(new BodySquirmle(170));
    squirmleList.add(new BodySquirmle(160));
    squirmleList.add(new BodySquirmle(150));

    let current = squirmleList.head;
    while(current != null){
        gameScreen.addChild(current.element);
        current = current.next;
    }
    
    controlScreen = new PIXI.Container();
    controlScreen.visible = false;
    stage.addChild(controlScreen);

    endScreen = new PIXI.Container();
    endScreen.visible = false;
    stage.addChild(endScreen);

    //a function that will put all the text,
    //objects, or buttons onto the title screen
    settupTitleScreen();

    keysDiv = document.querySelector("#keys");
}


//will create all the text, buttons, and objects
//onto the title screen
function settupTitleScreen(){
    
    //creates the title text
    let title = new PIXI.Text("Squirmle: The Game");
    title.style = new PIXI.TextStyle({
        fill: 0x00A86B,
        fontSize: 40,
        fontFamily: 'Georgia',
        stroke: 0x000000,
        strokeThickness: 4
    })
    title.x = 120;
    title.y = 120;
    titleScreen.addChild(title);

    //creates the button to let the player 
    //enter the game and start plaing
    let titleButton = new PIXI.Text("Start Your Journey");
    titleButton.style =  new PIXI.TextStyle({
        fill: 0x00A86B,
        fontSize: 40,
        fontFamily: 'Georgia',
        stroke: 0x000000,
        strokeThickness: 4
    })
    titleButton.interactive = true;
    titleButton.buttonMode = true;
    titleButton.on("pointerup", startGame);//will call the function to start the game for the player
    titleButton.on('pointerover', e=> e.target.alpha = .7);
    titleButton.on('pointerour', e=>e.currentTarget.alpha = 1.0);
    titleButton.x = 130;
    titleButton.y = 500;
    titleScreen.addChild(titleButton);

}

//will create all the text, buttons, and objects
//onto the game screen
function settupGameScreen(){

}

//will create all the text, buttons, and objects
//onto the end screen
function settupEndScreen(){

}

//function that starts the game for the player
function startGame(){
    // changes the visible screen to the game screen
    titleScreen.visible = false;
    gameScreen.visible = true;

    // Start update loop
    app.ticker.add(gameLoop);
}

function gameLoop(){
    keysDiv.innerHTML = JSON.stringify(keys);
    
    movementBigSquirmle();

    foodFunctions();
    
    setInterval(movementBigSquirmle, 100);
}

function gameLoop(){
	//if (paused) return; // keep this commented out for now
	
	// #1 - Calculate "delta time"
    //let dt = 1/app.ticker.FPS;
    //if (dt > 1/30) dt=1/30;

    // Likely going to exclude the movementBigSquirmle() from the
    // game loop to make it look like a staggered movement
    // where as communist shit will just roam around freely updating every frame
    //movementBigSquirmle();
}

function movementBigSquirmle(){
    // Track all of the head's direction and coordinates from the previous frame to the current
    let headSquirmle = squirmleList.head.element;
    let prevDirection = headSquirmle.direction;
    headSquirmle.prevX = headSquirmle.x;
    headSquirmle.prevY = headSquirmle.y;

    // Use else if statements as the big squirmle won't be able to move diagonally
    // Also prevent big squirmle from going the opposite direction that it is currently traveling
    // so it won't kill itself
    if (keys["87"] && prevDirection != "down"){ // W
        headSquirmle.direction = "up";
    }
    else if (keys["65"] && prevDirection != "right"){ // A
        headSquirmle.direction = "left";
    }
    else if (keys["83"] && prevDirection != "up"){ // S
        headSquirmle.direction = "down";
    }
    else if (keys["68"] && prevDirection != "left"){ // D
        headSquirmle.direction = "right";
    }

    // Move the head's x and y coordinates based on direction facing
    if(headSquirmle.direction == "up"){
        headSquirmle.y -= 20;
    }
    else if(headSquirmle.direction == "left"){
        headSquirmle.x -= 20;
    }
    else if(headSquirmle.direction == "down"){
        headSquirmle.y += 20;
    }
    else if(headSquirmle.direction == "right"){
        headSquirmle.x += 20;
    }

    // Move each body part to the previous location of the body part in front of it
    let current = squirmleList.head.next;
    while(current != null){
        current.element.prevX = current.element.x;
        current.element.prevY = current.element.y;
        current.element.x = current.prev.element.prevX;
        current.element.y = current.prev.element.prevY;

        current = current.next;
    }
}

function keysDown(e) {
    keys[e.keyCode] = true;
}

function keysUp(e) {
    keys[e.keyCode] = false;
}

function foodFunctions(){

    if (food == null) {
        food = new Food();
        gameScreen.addChild(food);
    }
    else if (food != null) {
        if (b.hit(bigSquirmle, food)) {
            food.isAlive = false;
            Object.destroy(food);
        }
    }
}