let scale = 5;
let camera = {};

function pos([x, y]) {
  const _x = (x - camera.x) / scale + 600;
  const _y = (-y + camera.y) / scale + 350;

  return [_x, _y];
}

export { scale, camera, pos };
