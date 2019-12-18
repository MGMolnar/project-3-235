"use strict";

const app = new PIXI.Application(600,600);
document.body.appendChild(app.view);

//gets the bounds of the game view
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

//variables for all the screens
let titleScreen;
let endScreen;
let gameScreen;

let stage;
let keys = {};
let headSquirmle;
let current;

let babySquirmle = null;

//creates the current food
//and the overall amount of food consumed
let foodCount = 0;
let food = null;

let playing = false;
let playingSquirmle;

//is used for any collisions int he game
let b = new Bump(PIXI);

let squirmleList;
let spriteHead = PIXI.Texture.fromImage("media/squirmleHead.png");
let spriteTail = PIXI.Texture.fromImage("media/squirmleTail.png");
let spriteTailBot = PIXI.Texture.fromImage("media/squirmleTailBot.png");
let spriteTailRight = PIXI.Texture.fromImage("media/squirmleTailRight.png");
let spriteTailLeft = PIXI.Texture.fromImage("media/squirmleTailLeft.png");
let spriteRightToUp = PIXI.Texture.fromImage("media/rightToUp.png");
let spriteRightToBot = PIXI.Texture.fromImage("media/rightToBot.png");
let spriteLeftToUp = PIXI.Texture.fromImage("media/leftToUp.png");
let spriteLeftToBot = PIXI.Texture.fromImage("media/leftToBot.png");
let spriteBody = PIXI.Texture.fromImage("media/squirmleBody.png");
let spriteEmpty = PIXI.Texture.fromImage("media/empty.png");

//https://www.textures.com/
let grass = PIXI.Texture.fromImage("media/grass.JPG");

//https://www.html5gamedevs.com/topic/13784-full-screen-background-image/
let titleBackground = new PIXI.Sprite(grass);
let gameBackground = new PIXI.Sprite(grass);
let endBackground = new PIXI.Sprite(grass);

//settups the enemy list for the game
let enemyList = [];

let eatSound = new Howl({
    src: ['media/eating.wav']
});
let babySound = new Howl({
    src: ['media/babySpawn.FLAC']
});
let gameOverSound = new Howl({
    src: ['media/gameOver.WAV']
});
let gameplayMusic = new Howl({
    src: ['media/playMusic.WAV']
});

let up = 0;
let left = 3 * Math.PI/2;
let down = Math.PI;
let right = Math.PI/2;

let score = 0;
let gameScore;

//text for the score on the end screen
let textScore;
let textHighScore;

window.addEventListener("keydown", keysDown);
window.addEventListener("keyup", keysUp);

let prefix;
let highScoreKey;
let storedHighScore;

window.onload = init;

createPages();


// Functions
function init(){
    // Give each search option a key for storage
    prefix = "nmm3037-";
    highScoreKey = prefix + "highScore";

    storedHighScore = localStorage.getItem(highScoreKey);
    if (storedHighScore){
        //textHighScore = new PIXI.Text(`Your High Score: ${storedHighScore}`);
    }
}

//used to create the four different scenes in the scene.
function createPages(){
    
    stage = app.stage;

    //creates the titleScreen and adds it to the stage
    titleScreen = new PIXI.Container();
    stage.addChild(titleScreen);

    //creates the game screen and sets it to be invisible
    gameScreen = new PIXI.Container();
    gameScreen.visible = false;
    stage.addChild(gameScreen);

    //creates the background on the gamescreen to be visible
    gameScreen.addChild(gameBackground);

    squirmleList = new LinkedList();
    squirmleList.add(new BodySquirmle(210, 210));
    headSquirmle = squirmleList.head.element;
    headSquirmle.texture = spriteHead;
    squirmleList.add(new BodySquirmle(190, 210));
    squirmleList.add(new BodySquirmle(170, 210));
    squirmleList.add(new BodySquirmle(150, 210));
    squirmleList.tail.element.texture = spriteTailBot;

    let current = squirmleList.head;
    while(current != null){
        gameScreen.addChild(current.element);
        current = current.next;
    }

    //creates the end screen and sets it to be invisible
    endScreen = new PIXI.Container();
    endScreen.visible = false;
    stage.addChild(endScreen);

    //a function that will put all the text,
    //objects, or buttons onto the title screen
    settupTitleScreen();

    //function that will add any sort of text to the game  screen
    settupGameScreen();

    //function that will settup the end screen
    settupEndScreen();
}


//will create all the text, buttons, and objects
//onto the title screen
function settupTitleScreen(){
    
    //adds the background to the title screen
    titleScreen.addChild(titleBackground);

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

    //creates the control text on the title screen
    let controls = new PIXI.Text("W, A, S, D - Squirmle Movement " +  
    "\nSpace - Create a Baby Squirmle " +
    "\nMouse - Moves baby squirmles " +
    "\nAvoid the enemy squirmles");
    controls.style = new PIXI.TextStyle({
        fill: 0x00A86B,
        fontSize: 30,
        fontFamily: 'Georgia',
        stroke: 0x000000,
        strokeThickness: 4
        
    })
    controls.anchor.set(.5);
    controls.x = 330;
    controls.y = 320;
    titleScreen.addChild(controls);

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
    titleButton.on('pointerout', e=>e.currentTarget.alpha = 1.0);
    titleButton.x = 130;
    titleButton.y = 500;
    titleScreen.addChild(titleButton);

}

//will create all the text, buttons, and objects
//onto the game screen
function settupGameScreen(){

    //sets the game score text to be 0 in the upper left hand corner
    gameScore = new PIXI.Text("Score: 0");
    gameScore.style =  new PIXI.TextStyle({
        fill: 0x00A86B,
        fontSize: 28,
        fontFamily: 'Georgia',
        stroke: 0x000000,
        strokeThickness: 4
    })
    gameScore.x = 5;
    gameScore.y = 0;
    gameScreen.addChild(gameScore);
}

//will create all the text, buttons, and objects
//onto the end screen
function settupEndScreen(){
    
    //adds the background to the end screen
    endScreen.addChild(endBackground);

    //creates the death screen text
    let endText = new PIXI.Text("You have Died");
    endText.style = new PIXI.TextStyle({
        fill: 0x00A86B,
        fontSize: 40,
        fontFamily: 'Georgia',
        stroke: 0x000000,
        strokeThickness: 4
    })
    endText.x = 160;
    endText.y = 100;
    endScreen.addChild(endText);

    //text that displays the final score onto the end screen
    textScore = new PIXI.Text(`Your Final Score: ${score}`);
    textScore.style = new PIXI.TextStyle({
        fill: 0x00A86B,
        fontSize: 40,
        fontFamily: 'Georgia',
        stroke: 0x000000,
        strokeThickness: 4
    });
    textScore.x = 125;
    textScore.y = 300;
    endScreen.addChild(textScore);

    textHighScore = new PIXI.Text(`Your High Score: ${Math.round(localStorage.getItem(highScoreKey))}`);
    textHighScore.style = new PIXI.TextStyle({
        fill: 0x00A86B,
        fontSize: 40,
        fontFamily: 'Georgia',
        stroke: 0x000000,
        strokeThickness: 4
    });
    textHighScore.x = 125;
    textHighScore.y = 380;
    endScreen.addChild(textHighScore);

    //creates a button that will reset the game and 
    //put the player back at the title screen
    let endButton = new PIXI.Text("Restart Your Journey");
    endButton.style =  new PIXI.TextStyle({
        fill: 0x00A86B,
        fontSize: 40,
        fontFamily: 'Georgia',
        stroke: 0x000000,
        strokeThickness: 4
    })
    endButton.interactive = true;
    endButton.buttonMode = true;
    endButton.on("pointerup", restartGame);//will call the function to restart the game for the player
    endButton.on('pointerover', e=> e.target.alpha = .7);
    endButton.on('pointerout', e=>e.currentTarget.alpha = 1.0);
    endButton.x = 110;
    endButton.y = 480;
    endScreen.addChild(endButton);
}

//function that starts the game for the player
function startGame(){
    // changes the visible screen to the game screen
    titleScreen.visible = false;
    gameScreen.visible = true;
    endScreen.visible = false;

    foodCount = 0;

    // Start update loop
    app.ticker.add(gameLoop);

    playing = true;

    playingSquirmle = setInterval(movementBigSquirmle, 100);

    gameplayMusic.play();
}

//function that works as the game loop for the game
function gameLoop(){

    //checks to see if there is a baby squirmle
    //if not use the baby squirmle functions
    if (babySquirmle != null){
        babySquirmleFunctions(babySquirmle);
    }

    //function that will test to 
    //see if the big squirmle is outside the bounds
    //of the screen
    wallCollision();

    //function that will see
    //if the big squirmle collides with itself
    selfCollision();
    
    //function for any of the functions
    //that the food will need
    foodFunctions();

    //function that will spawn enemies
    spawnEnemies();

    //function that is used for
    //all of the uses that enemies have in game
    enemyFunctions();

    score += 0.01;
    gameScore.text = `Score: ${Math.round(score)}`;
    //for each loop that will go through all 
    //the enemies and then have them check their
    //collision with other enemies
    enemyList.forEach(enemy => {
        if (enemy != undefined) {
            enemyCollision(enemy);    
        }
    });
}

function movementBigSquirmle(){
    // Track all of the head's direction and coordinates from the previous frame to the current
    //headSquirmle = squirmleList.head.element;
    headSquirmle.prevRotation = headSquirmle.rotation;
    headSquirmle.prevX = headSquirmle.x;
    headSquirmle.prevY = headSquirmle.y;

    // Use else if statements as the big squirmle won't be able to move diagonally
    // Also prevent big squirmle from going the opposite direction that it is currently traveling
    // so it won't kill itself
    if (keys["87"] && headSquirmle.prevRotation != down){ // W
        headSquirmle.rotation = up;
    }
    else if (keys["65"] && headSquirmle.prevRotation != right){ // A
        headSquirmle.rotation = left;
    }
    else if (keys["83"] && headSquirmle.prevRotation != up){ // S
        headSquirmle.rotation = down;
    }
    else if (keys["68"] && headSquirmle.prevRotation != left){ // D
        headSquirmle.rotation = right;
    }
    else if(keys["32"] && babySquirmle == null && squirmleList.size > 3){ // Spacebar
        babySound.play();

        squirmleList.tail.element.texture = spriteEmpty;
        squirmleList.poop();
        
        babySquirmle = new BabySquirmle(headSquirmle.x, headSquirmle.y);
        gameScreen.addChild(babySquirmle);

        squirmleList.tail.element.texture = spriteTailLeft;
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
    current = squirmleList.head.next;
    while(current != null){
        // Move the body part
        current.element.prevX = current.element.x;
        current.element.prevY = current.element.y;
        current.element.x = current.prev.element.prevX;
        current.element.y = current.prev.element.prevY;

        // Set rotation of each body part to check for corner sprites
        current.element.prevRotation = current.element.imageRotation;
        current.element.imageRotation = current.prev.element.prevRotation;

        current = current.next;
    }

    current = squirmleList.head.next;
    // Change sprite of each body part if they are changing directions AKA a corner is formed
    while(current != null){
        if(current.next != null){ 
            if((current.next.element.x - current.element.x == -20 && 
                current.element.x - current.prev.element.x == 0 && 
                current.element.y - current.prev.element.y == 20) || 
                (current.next.element.y - current.element.y == -20 && 
                current.element.y - current.prev.element.y == 0 && 
                current.element.x - current.prev.element.x == 20))
            {
                current.element.texture = spriteRightToBot;
            }
            else if((current.next.element.x - current.element.x == -20 && 
                current.element.x - current.prev.element.x == 0 && 
                current.element.y - current.prev.element.y == -20) || 
                (current.next.element.y - current.element.y == 20 && 
                current.element.y - current.prev.element.y == 0 && 
                current.element.x - current.prev.element.x == 20))
            {
                current.element.texture = spriteLeftToBot;
            }
            else if((current.next.element.x - current.element.x == 20 && 
                current.element.x - current.prev.element.x == 0 && 
                current.element.y - current.prev.element.y == 20) || 
                (current.next.element.y - current.element.y == -20 && 
                current.element.y - current.prev.element.y == 0 && 
                current.element.x - current.prev.element.x == -20))
            {
                current.element.texture = spriteRightToUp;
            }
            else if((current.next.element.x - current.element.x == 20 && 
                current.element.x - current.prev.element.x == 0 && 
                current.element.y - current.prev.element.y == -20) || 
                (current.next.element.y - current.element.y == 20 && 
                current.element.y - current.prev.element.y == 0 && 
                current.element.x - current.prev.element.x == -20))
            {
                current.element.texture = spriteLeftToUp;
            }
            else {
                current.element.texture = spriteBody;
            }
        }
        else { // This is to change the tail's rotation to fit right
            if(current.prev.element.imageRotation % (2 * Math.PI) == up){
                current.element.texture = spriteTailRight;
            }
            else if(current.prev.element.imageRotation % (2 * Math.PI) == left){
                current.element.texture = spriteTail;
            }
            else if(current.prev.element.imageRotation % (2 * Math.PI) == down){
                current.element.texture = spriteTailLeft;
            }
            else if(current.prev.element.imageRotation % (2 * Math.PI) == right){
                current.element.texture = spriteTailBot;
            }
        }
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
            eatSound.play();
            score += 5;
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
    gameScreen.addChild(bodySquirmle);
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
        
        let random = Math.random()
        let tempX;
        let tempY;
        if (random < 0.25){
            tempX = -50;
            tempY = Math.random() * 700;
        }
        else if (random < 0.5){
            tempX = 650;
            tempY = Math.random() * 700;
        }
        else if (random < 0.75){
            tempX = Math.random() * 700;
            tempY = -50;
        }
        else {
            tempX = Math.random() * 700;
            tempY = 650;
        }

        let enemy = new EnemySquirmle(tempX, tempY);
        
        if (enemyList[i] == null) {
            enemyList[i] = enemy;

            gameScreen.addChild(enemyList[i]);
        }
    }
}

//function that will go through all the enemies
//let them move and checks to see if there is a
//collision between the head squirmle and an enemy
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
        
        //gets the vector between the enemy and headsquirmle for both
        //x and y directions
        let directionX = enemy.x - headSquirmle.x;
        let directionY = enemy.y - headSquirmle.y;
        
        //changes the enemy rotation based on the angle between both the x and y direction
        //it is in the opposition direction so rotate by 90
        enemy.rotation = Math.atan2(directionY, directionX) - 90;

    });
}

//function that will move the baby squirmle,
//check to see if it collides with an enemy
//and any other functions
function babySquirmleFunctions(bodySquirmle){

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
            babySound.stop();
            gameScreen.removeChild(babySquirmle);
            babySquirmle = null;
            gameScreen.removeChild(enemyList[i]);
            enemyList[i] = null

        }
    }
}

//function that will check to see 
//the headsquirmle is outside the scene bounds
function wallCollision(){

    //headsquirmle x position is too high
    if (headSquirmle.x > sceneWidth) {
        endGame();
    }
    //headsqurmle x position too low
    else if (headSquirmle.x < 0) {
        endGame();
    }
    //headsquirmle y position is too high
    else if (headSquirmle.y > sceneHeight) {
        endGame();
    }
    //headsquirmle y position is too low
    else if (headSquirmle.y < 0) {
        endGame();
    }
}

function selfCollision(){

    current = squirmleList.head.next;
    while(current != null){
        if(current.element.x == squirmleList.head.element.x && current.element.y == squirmleList.head.element.y){
            endGame();
        }

        current = current.next;
    }
}

//function that will stop the game
//and move the player to the end screen
function endGame(){
    clearInterval(playingSquirmle);

    // removes game loop from ticking
    app.ticker.remove(gameLoop);

    //updates the text score on the final screen with the score from in game
    textScore.text = `Your Final Score: ${Math.round(score)}`;
    textHighScore.text = `Your High Score: ${Math.round(localStorage.getItem(highScoreKey))}`;

    //switches screens to end screen
    gameScreen.visible = false;
    endScreen.visible = true;

    //switches from the game music to
    //the game over music
    gameplayMusic.stop();
    gameOverSound.play();

    if(score > storedHighScore){
        localStorage.setItem(highScoreKey, score);
    }

    //stops any extra sounds going on
    babySound.stop();
    eatSound.stop();

    //removes all enemies from the game
    //then creates a new fresh enemy list
    enemyList.forEach(enemy => {
        gameScreen.removeChild(enemy);
    });
    enemyList = [];

    //reset baby
    babySound.stop();
    gameScreen.removeChild(babySquirmle);
    babySquirmle = null;

    // reset the squirmle
    let size = squirmleList.size
    for (let i = 0; i < size; i++) {
        squirmleList.tail.element.texture = spriteEmpty;
        squirmleList.poop();
    }
    squirmleList.head.element.texture = spriteEmpty;
    squirmleList.head = null;
    squirmleList.tail.element.texture = spriteEmpty;
    squirmleList.tail = null;
    squirmleList.size = 0;

    squirmleList.add(new BodySquirmle(210, 210));
    headSquirmle = squirmleList.head.element;
    headSquirmle.texture = spriteHead;
    squirmleList.add(new BodySquirmle(190, 210));
    squirmleList.add(new BodySquirmle(170, 210));
    squirmleList.add(new BodySquirmle(150, 210));
    squirmleList.add(new BodySquirmle(130, 210));
    squirmleList.tail.element.texture = spriteTailBot;

    let currently = squirmleList.head;
    while(currently != null){
        gameScreen.addChild(currently.element);
        currently = currently.next;
    }
    

    // reset other stats
    gameScreen.removeChild(food);
    food = null;
    foodCount = 0;
    score = 0;
}

//sends you back to the start screen
function restartGame(){
    endScreen.visible = false;
    titleScreen.visible = true;
}

//function that will check to see if 
//one enemy is colliding with any others
//if they do then have them move away from the colliding enemy
function enemyCollision(enemy){
    for (let i = 0; i < enemyList.length; i++) {
        if (enemy != enemyList[i] && enemyList[i] != undefined){
            if(b.hit(enemy, enemyList[i])) {
                enemy.x += enemy.x - enemyList[i].x;
            }
        }
    }
}


// we use this to keep the ship on the screen
function clamp(val, min, max){
    return val < min ? min : (val > max ? max : val);
}
