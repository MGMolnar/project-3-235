"use strict";

const app = new PIXI.Application(600,600);
document.body.appendChild(app.view);

const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

let titleScreen;
let endScreen;
let gameScreen;
let controlScreen;
let stage;
let keys = {};
let keysDiv;
let headSquirmle;

let babySquirmle = null;

let foodCount = 0;
let food = null;

let b = new Bump(PIXI);
let squirmleList;
let spriteHead = PIXI.Texture.fromImage("media/squirmleHead.png");
let spriteTail = PIXI.Texture.fromImage("media/squirmleTailTest.png");

let enemyList = [];

let up = 0;
let left = 3 * Math.PI/2;
let down = Math.PI;
let right = Math.PI/2;

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

    squirmleList = new LinkedList();
    squirmleList.add(new BodySquirmle());
    headSquirmle = squirmleList.head.element;
    headSquirmle.texture = spriteHead;
    squirmleList.add(new BodySquirmle(180));
    squirmleList.add(new BodySquirmle(160));
    squirmleList.add(new BodySquirmle(140));
    squirmleList.add(new BodySquirmle(120));
    squirmleList.tail.element.texture = spriteTail;

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

    foodCount = 0;

    // Start update loop
    app.ticker.add(gameLoop);

    setInterval(movementBigSquirmle, 100);
}

function gameLoop(){
    keysDiv.innerHTML = JSON.stringify(keys);
    
    //movementBigSquirmle()

    if (babySquirmle != null){
        babySqurmleFunctions(babySquirmle);
    }

    foodFunctions();

    spawnEnemies();

    enemyFunctions();
    
    
}

/*function gameLoop(){
	//if (paused) return; // keep this commented out for now
	
	// #1 - Calculate "delta time"
    //let dt = 1/app.ticker.FPS;
    //if (dt > 1/30) dt=1/30;

    // Likely going to exclude the movementBigSquirmle() from the
    // game loop to make it look like a staggered movement
    // where as communist shit will just roam around freely updating every frame
    //movementBigSquirmle();
}*/

function movementBigSquirmle(){
    // Track all of the head's direction and coordinates from the previous frame to the current
    //headSquirmle = squirmleList.head.element;
    let prevDirection = headSquirmle.rotation;
    headSquirmle.prevX = headSquirmle.x;
    headSquirmle.prevY = headSquirmle.y;

    // Use else if statements as the big squirmle won't be able to move diagonally
    // Also prevent big squirmle from going the opposite direction that it is currently traveling
    // so it won't kill itself
    if (keys["87"] && prevDirection != down){ // W
        headSquirmle.rotation = up;
    }
    else if (keys["65"] && prevDirection != right){ // A
        headSquirmle.rotation = left;
    }
    else if (keys["83"] && prevDirection != up){ // S
        headSquirmle.rotation = down;
    }
    else if (keys["68"] && prevDirection != left){ // D
        headSquirmle.rotation = right;
    }
    else if(keys["32"] && babySquirmle == null){ // Spacebar
        squirmleList.poop();
        
        babySquirmle = new BabySquirmle(headSquirmle.x, headSquirmle.y);
        gameScreen.addChild(babySquirmle);

        squirmleList.tail.element.texture = spriteTail;
    }

    // Move the head's x and y coordinates based on direction facing
    if(headSquirmle.rotation % (2 * Math.PI) == up){
        headSquirmle.y -= 20;
    }
    else if(headSquirmle.rotation % (2 * Math.PI) == left){
        headSquirmle.x -= 20;
    }
    else if(headSquirmle.rotation % (2 * Math.PI) == down){
        headSquirmle.y += 20;
    }
    else if(headSquirmle.rotation % (2 * Math.PI) == right){
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

//function that will be used to check to see if
//there is a collision between the head squrimle 
function foodFunctions(){

    //if there is no food create a food and add it
    //to the scene
    if (food == null) {
        food = new Food();
        gameScreen.addChild(food);
    }
    //if there is a food check to see if there is a collision
    //if there is a collision remove that food and create a new food 
    else if (food != null) {
        if (b.hit(headSquirmle, food)) {
            gameScreen.removeChild(food);
            food = new Food();
            foodCount++;
            gameScreen.addChild(food);

            addBodySquirmle();
        }
    }
}

//function that will add a body squirmle
//to the body of the squirmle
function addBodySquirmle(){

    let bodySquirmle = new BodySquirmle();
    squirmleList.add(bodySquirmle);
}

//function that will spawn more enemies 
//depending on how many foods that were eaten
function spawnEnemies(){

    //calculates the amount of enemies that should be spawned
    let enemyCount = parseInt(foodCount / 2);


    //if there is less than one food eaten 
    //then only make one enemy allowed
    if (enemyCount < 1) {
        enemyCount = 1;
    }
    
    //for loop that will create the enemies 
    //then adds them to the list of enemies
    for (let i = 0; i < enemyCount; i++) {
        let enemy = new EnemySquirmle();
        
        if (enemyList[i] == null) {
            enemyList[i] = enemy;

            gameScreen.addChild(enemyList[i]);
        }
    }

}

//function that will go through all the enemies
//let them move and checks to see if there is a
//collision
function enemyFunctions(){
    enemyList.forEach(enemy => {
        if (enemy.x - headSquirmle.x < 0) {
            enemy.x += .5;
        }

        if (enemy.x - headSquirmle.x > 0) {
            enemy.x -= .5;
        }

        if (enemy.y - headSquirmle.y < 0) {
            enemy.y += .5;
        }

        if (enemy.y - headSquirmle.y > 0) {
            enemy.y -= .5;
        }

        if (b.hit(headSquirmle, enemy)) {
            endGame();
        }

    });
}

//function that will move the baby squirmle,
//check to see if it collides with an enemy
//and any other functions
function babySqurmleFunctions(bodySquirmle){

    //gets the mouse position in the game screen
    let mousePosition = app.renderer.plugins.interaction.mouse.global;

    //gets the delta time of the game 
    let deltaTime = 1/app.ticker.FPS;
    if(deltaTime > 1/32) deltaTime = 1/32;
    let amt = 6 * deltaTime;

    //creates the new x and y positions using 
    //linear interpolate
    let newX = bodySquirmle.x * (1-amt) + amt * mousePosition.x;
    let newY = bodySquirmle.y * (1-amt) + amt * mousePosition.y;

    //gets the heiht and width of the squrimle
    let w2 = bodySquirmle.width/2;
    let h2 = bodySquirmle.height/2;

    //clamps the squirmle to inside of the scene
    bodySquirmle.x = clamp(newX, 0+w2, sceneWidth-w2);
    bodySquirmle.y = clamp(newY, 0+h2, sceneHeight-h2)

    //for loop that will go through the enemies and check to see
    //if there is a collision with the babysqurimle
    for (let i = 0; i < enemyList.length; i++) {

        //if there is a collision remove both the 
        //baby squrimle and the enemy from the game
        if (b.hit(bodySquirmle, enemyList[i])) {

            gameScreen.removeChild(babySquirmle);
            babySquirmle = null;
            gameScreen.removeChild(enemyList[i]);
            enemyList[i] = null

        }
    }
    
}



//sets the endscreen to be visible
function endGame(){
    gameScreen.visible = false;
    endScreen.visible = true;
}	

// we use this to keep the ship on the screen
function clamp(val, min, max){
    return val < min ? min : (val > max ? max : val);
}
