"use strict";

const app = new PIXI.Application(600,600);
document.body.appendChild(app.view);

let titleScreen;
let endScreen;
let gameScreen;
let controlScreen;
let bigSquirmle;
let stage;

//used to create the four different scenes in the scene.
function createPages(){

    //creates the titleScreen and adds it to the stage
    titleScreen = new PIXI.Container();
    stage.appendChild(titleScreen);
    
    //a function that will put all the text,
    //objects, or buttons onto the title screen
    settupTitleScreen();


    gameScreen = new PIXI.Container();
    gameScreen.visible = false;
    stage.addchild(gameScreen);

    controlScreen = new PIXI.Container();
    controlScreen.visible = false;
    stage.addchild(controlScreen);

    endScreen = new PIXI.Container();
    endScreen.visible = false;
    stage.addchild(endScreen);a


}

//will create all the text, buttons, and objects
//onto the title screen
function settupTitleScreen(){

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