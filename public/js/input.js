import Keyboard from "./KeyboardState.js";
import { camera } from "./_camera.js";

const KEYMAP = {
  UP: "KeyW",
  DOWN: "KeyS",
  LEFT: "KeyA",
  RIGHT: "KeyD",
  A: "Minus",
  B: "Equal",
};

export function setupKeyboard(window) {
  const input = new Keyboard();
  const router = null;

  input.listenTo(window);
  const step = 16;

  input.addMapping(KEYMAP.UP, (keyState) => {
    camera.y += step * camera.scale;
  });

  input.addMapping(KEYMAP.DOWN, (keyState) => {
    camera.y -= step * camera.scale;
  });

  input.addMapping(KEYMAP.LEFT, (keyState) => {
    camera.x -= step * camera.scale;
  });

  input.addMapping(KEYMAP.RIGHT, (keyState) => {
    camera.x += step * camera.scale;
  });

  input.addMapping(KEYMAP.A, (keyState) => {
    if (camera.scale > 2048) return;

    camera.scale *= Math.sqrt(2);
  });

  input.addMapping(KEYMAP.B, (keyState) => {
    if (camera.scale < 2) return;
    camera.scale /= Math.sqrt(2);
  });

  return router;
}
