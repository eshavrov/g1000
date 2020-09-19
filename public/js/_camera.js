let camera = { x: 19457719.3, y: -4440229.7, scale: 1 };

function pos([x, y]) {
  const _x = (x - camera.x) / camera.scale + camera.offsetX;
  const _y = (-y + camera.y) / camera.scale + camera.offsetY;

  return [_x, _y];
}

export { camera, pos };
