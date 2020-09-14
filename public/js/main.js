import Timer from "./Timer.js";
import Scene from "./Scene.js";
import SceneRunner from "./SceneRunner.js";
import { createBackgroundLayer } from "./layers/bg.js";
import { createDashboardLayer } from "./layers/dashboard.js";
import { createPanelLayer } from "./layers/panel.js";
import { createWINDLayer} from "./layers/WIND.js"
import { loadImage } from './loaders.js'

async function main(canvas) {
  const videoContext = canvas.getContext("2d");
  const audioContext = new AudioContext();
  const sceneRunner = new SceneRunner();
  loadImage("/img/index.png").then(image=>{
    console.log("loaded image", image);
  })

  function createLoadingScreen() {
    const scene = new Scene();


    loadImage("/img/panel.png").then(image=>{
      scene.comp.layers.push(createBackgroundLayer("#553300",image));
      scene.comp.layers.push(createDashboardLayer());
      scene.comp.layers.push(createPanelLayer());
      scene.comp.layers.push(createWINDLayer());


    })

    return scene;
  }
  const loadingScreen = createLoadingScreen();

  sceneRunner.addScene(loadingScreen);

  sceneRunner.runNext();

  const gameContext = {
    audioContext,
    videoContext,
    deltaTime: null,
    tick: 0,
  };

  const timer = new Timer(1 / 60);
  timer.update = function update(deltaTime) {
    gameContext.tick++;
    gameContext.deltaTime = deltaTime;
    sceneRunner.update(gameContext);
  };

  timer.start();
}

const canvas = document.getElementById("screen");

const start = () => {
  window.removeEventListener("click", start);
  main(canvas);
};

window.addEventListener("click", start);
