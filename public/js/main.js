import Timer from "./Timer.js";
import Scene from "./Scene.js";
import Level from "./Level.js";
import { setupKeyboard } from "./input.js";

import SceneRunner from "./SceneRunner.js";
import { createBackgroundLayer } from "./layers/bg.js";
import { createDashboardLayer } from "./layers/dashboard.js";
import { createPanelLayer } from "./layers/panel.js";
import { createWINDLayer } from "./layers/WIND.js";
import { createAirportsLayer } from "./layers/airports.js";
import { createZoneLayer } from "./layers/zone.js";

import { loadImage, loadJSON } from "./loaders.js";
import { camera } from "./_camera.js";

const getBoundingRect = (points) => {
  if (!(points && points.length > 0)) return;
  let left = points[0][0],
    top = points[0][1],
    right = left,
    bottom = top;

  points.forEach(([x, y]) => {
    left = Math.min(left, x);
    right = Math.max(right, x);

    top = Math.min(y, top);
    bottom = Math.max(y, bottom);
  });

  return [left, top, right, bottom];
};

async function main(canvas) {
  const videoContext = canvas.getContext("2d");

  var devicePixelRatio = window.devicePixelRatio || 1; // Change to 1 on retina screens to see blurry canvas.
  camera.devicePixelRatio = devicePixelRatio;

  camera.offsetX = canvas.width/2;
  camera.offsetY = canvas.height/2;

  canvas.width = Math.floor(canvas.width * devicePixelRatio);
  canvas.height = Math.floor(canvas.height * devicePixelRatio);
  videoContext.scale(devicePixelRatio, devicePixelRatio);
  const inputRouter = setupKeyboard(window);

  // Normalize coordinate system to use css pixels.
  const audioContext = new AudioContext();
  const sceneRunner = new SceneRunner();

  function createLoadingScreen() {
    const scene = new Level();
    Promise.all([
      loadImage("/img/panel.png"),
      loadJSON("/tools/APT/apt.json"),
      loadJSON("/tools/CIR/circles.json"),

      // loadJSON("/tools/earth_fix.json"),
      // loadJSON("/tools/earth_awy.json"),
    ]).then(([image, _airports, zones, points, edges]) => {
      const airports = _airports.map((airport) => {
        return {
          ...airport,
          boundingRect: getBoundingRect(
            airport.figures.reduce(
              (acc, { points }) =>
                acc.concat(points.map((point) => point.slice(0, 2))),
              []
            )
          ),
        };
      });
      // console.log(airports);
      // scene.comp.layers.push(createBackgroundLayer("#553300", image));
      // scene.comp.layers.push(createDashboardLayer());
      // scene.comp.layers.push(createPanelLayer());
      // scene.comp.layers.push(createWINDLayer());

      scene.comp.layers.push(createAirportsLayer(airports));
      scene.comp.layers.push(createZoneLayer(Object.values(zones)));
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

  const timer = new Timer(1 / 25);
  timer.update = function update(deltaTime) {
    gameContext.tick++;
    gameContext.deltaTime = deltaTime;
    sceneRunner.update(gameContext);
  };

  timer.start();
}

const canvas = document.getElementById("screen");

const start = () => {
  main(canvas);
};


start();
