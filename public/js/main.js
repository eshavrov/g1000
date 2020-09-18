import Timer from "./Timer.js";
import Scene from "./Scene.js";
import SceneRunner from "./SceneRunner.js";
import { createBackgroundLayer } from "./layers/bg.js";
import { createDashboardLayer } from "./layers/dashboard.js";
import { createPanelLayer } from "./layers/panel.js";
import { createWINDLayer } from "./layers/WIND.js";
import { createMapLayer } from "./layers/map.js";
import { createZoneLayer } from "./layers/zone.js";


import { loadImage, loadJSON } from "./loaders.js";

async function main(canvas) {
  const videoContext = canvas.getContext("2d");

  var scale = window.devicePixelRatio || 1; // Change to 1 on retina screens to see blurry canvas.
  canvas.width = Math.floor(canvas.width * scale);
  canvas.height = Math.floor(canvas.height * scale);
  videoContext.scale(scale, scale);
  loadJSON("/tools/earth_fix.json");

  // Normalize coordinate system to use css pixels.
  const audioContext = new AudioContext();
  const sceneRunner = new SceneRunner();

  function createLoadingScreen() {
    const scene = new Scene();
    Promise.all([
      loadImage("/img/panel.png"),
      loadJSON("/tools/APT/apt.json"),
      loadJSON("/tools/CIR/circles.json"),


      // loadJSON("/tools/earth_fix.json"),
      // loadJSON("/tools/earth_awy.json"),
    ]).then(([image, airports, zones, points, edges]) => {
      // scene.comp.layers.push(createBackgroundLayer("#553300", image));
      // scene.comp.layers.push(createDashboardLayer());
      // scene.comp.layers.push(createPanelLayer());
      // scene.comp.layers.push(createWINDLayer());

      // console.log(zones, Object.values(zones), airports);
      scene.comp.layers.push(createMapLayer(airports));
      // scene.comp.layers.push(createZoneLayer(Object.values(zones)));

    });

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

  const timer = new Timer(1/25 );
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
