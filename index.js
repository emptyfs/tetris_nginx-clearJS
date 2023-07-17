import Game from "./src/game.js";
import View from "./src/view.js";
import Controller from "./src/controller.js";

const element = document.querySelector('#root');//ссылка на root (корневой элемент)
const game = new Game();
const view = new View(element, 1366, 768, 20, 10);
const controller = new Controller(game, view);

window.game = game; //из-за модулей константа (game) не попадает в глобальное пространство имен
window.view = view;
window.controller = controller;
