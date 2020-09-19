import Camera from "./Camera.js";
import Scene from "./Scene.js";
import { camera } from "./_camera.js";

export default class Level extends Scene {
  constructor() {
    super();

    this.name = "";
    this.totalTime = 0;

    this.camera = new Camera();
    this.c = {};
  }

  draw(gameContext) {
    if (
      this.c.x === camera.x &&
      this.c.y === camera.y &&
      this.c.scale === camera.scale
    )
      return;
    this.c.x = camera.x;
    this.c.y = camera.y;
    this.c.scale = camera.scale;

    this.comp.draw(gameContext.videoContext, this.camera);
  }

  update(gameContext) {
    this.totalTime += gameContext.deltaTime;
  }

  pause() {}
}
