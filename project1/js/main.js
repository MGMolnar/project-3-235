"use strict";

const app = new PIXI.Application(600,600);
document.body.appendChild(app.view);

let titleScreen;
let endScreen;
let gameScreen;
let controlScreen;
let bigSquirmle;
let stage;

function createPages(){

    titleScreen = new PIXI.Container();
    stage.appendChild(titleScreen);

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
