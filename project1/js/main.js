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

window.addEventListener("keydown", keysDown);
window.addEventListener("keyup", keysUp);

createPages();

//used to create the four different scenes in the scene.
function createPages(){
    
    stage = app.stage;

    //creates the titleScreen and adds it to the stage
    titleScreen = new PIXI.Container();
    stage.addChild(titleScreen);
 
    //a function that will put all the text,
    //objects, or buttons onto the title screen
    settupTitleScreen();

    gameScreen = new PIXI.Container();
    gameScreen.visible = false;
    stage.addChild(gameScreen);

    bigSquirmle = new BigSquirmle();
    gameScreen.addChild(bigSquirmle);

    controlScreen = new PIXI.Container();
    controlScreen.visible = false;
    stage.addChild(controlScreen);

    endScreen = new PIXI.Container();
    endScreen.visible = false;
    stage.addChild(endScreen);

    // Start update loop
    app.ticker.add(gameLoop);

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

//will create all the text, buttons, and objects
//onto the control screen
function settupControlScreen(){

}

//function that starts the game for the player
function startGame(){
    // changes the visible screen to the game screen
    titleScreen.visible = false;
    gameScreen.visible = true;
}

function gameLoop(){
    keysDiv.innerHTML = JSON.stringify(keys);
    
    movementBigSquirmle();
    
	//if (paused) return; // keep this commented out for now
	
	// #1 - Calculate "delta time"
    //let dt = 1/app.ticker.FPS;
    //if (dt > 1/12) dt=1/12;
}

function movementBigSquirmle(){
    let prevDirection = bigSquirmle.direction;

    // Use else if statements as the big squirmle won't be able to move diagonally
    // Also prevent big squirmle from going the opposite direction that it is currently traveling
    // so it won't kill itself
    if (keys["87"] && prevDirection != "down"){ // W
        bigSquirmle.direction = "up";
    }
    else if (keys["65"] && prevDirection != "right"){ // A
        bigSquirmle.direction = "left";
    }
    else if (keys["83"] && prevDirection != "up"){ // S
        bigSquirmle.direction = "down";
    }
    else if (keys["68"] && prevDirection != "left"){ // D
        bigSquirmle.direction = "right";
    }

    // Move squirmle based on direction faced
    if(bigSquirmle.direction == "up"){
        bigSquirmle.y -= 1;
    }
    else if(bigSquirmle.direction == "left"){
        bigSquirmle.x -= 1;
    }
    else if(bigSquirmle.direction == "down"){
        bigSquirmle.y += 1;
    }
    else if(bigSquirmle.direction == "right"){
        bigSquirmle.x += 1;
    }
}

function keysDown(e) {
    console.log(e.keyCode);
    keys[e.keyCode] = true;
}

function keysUp(e) {
    console.log(e.keyCode);
    keys[e.keyCode] = false;
}