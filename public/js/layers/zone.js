import {
  TYPES,
  FUNCTION_LINE,
  setLineStyles,
} from "../components/lines/constants.js";
import { camera, pos } from "../_camera.js";

function angleBetween([x, y], [x2, y2]) {
  return Math.atan2(y2 - y, x2 - x);
}

const currentPosition = {};

function startPoint(context, type, x, y) {
  context.moveTo(x, y);
  currentPosition.x = x;
  currentPosition.y = y;
}

function nextPoint(context, type, x, y, ...other) {
  if (currentPosition.x == null) return;
  const func = FUNCTION_LINE[type];

  const start = { x: currentPosition.x, y: currentPosition.y };
  func(context, start, x, y, ...other);

  currentPosition.x = x;
  currentPosition.y = y;
}

function drawCircle(context, points, radius) {
  context.save();
  context.fillStyle = "#fff";
  context.beginPath();
  points.forEach((point) => {
    const [x, y] = point;
    // const _x = (x / 10000 - 1640) * 3 - 300;
    // const _y = (-y / 10000 - 300) * 3 - 300;

    // 19688717.1, -4788508.9
    // console.log(x,y,target);
    const [_x, _y] = pos([x, y]);

    context.moveTo(_x + radius, _y);
    context.arc(_x, _y, radius, 0, 2 * Math.PI);
  });
  context.stroke();
  context.closePath();
  context.restore();
}

function drawArc(context, points, radius, flag) {
  context.save();
  context.beginPath();
  points.forEach((point) => {
    const [x, y, x2, y2, r] = point;
    // const _x = (x / 10000 - 1640) * 3 - 300;
    // const _y = (-y / 10000 - 300) * 3 - 300;

    // 19688717.1, -4788508.9
    // console.log(x,y,target);
    // const cx = (x + x2) / 2;
    // const cy = (y + y2) / 2;

    const [_x, _y] = pos([x, y]);
    const [_x2, _y2] = pos([x2, y2]);
    // const [_cx, _cy] = pos([cx, cy]);

    // const d = Math.sqrt((x - x2) ** 2 + (y - y2) ** 2);
    // console.log(x, y, x2, y2, r, d);
    // const _r = d / 2 / camera.scale;
    const _r0 = r / camera.scale;

    // context.moveTo(_x, _y);
    // context.lineTo(_x2, _y2);

    const angle = angleBetween([x, y], [x2, y2]);

    // context.moveTo(_cx + _r * Math.cos(-angle), _cy + _r * Math.sin(-angle));
    // context.arc(_cx, _cy, _r, -angle, -angle + Math.PI, flag);
    context.lineTo(_x, _y);

    context.moveTo(_x2 + _r0, _y2);
    context.arc(_x2, _y2, _r0, 0, 2 * Math.PI);
  });
  context.stroke();
  context.closePath();
  context.restore();
}

function drawPoints(context, type, points) {
  context.save();
  setLineStyles(context, type);
  context.fillStyle = "#fff";
  context.beginPath();
  points.forEach((point, index) => {
    // const [x, y] = point;
    const [x, y, x2, y2, r] = point;

    const setPoint = index === 0 ? startPoint : nextPoint;
    // const _x = (x / 10000 - 1640) * 3 - 300;
    // const _y = (-y / 10000 - 300) * 3 - 300;

    // 19688717.1, -4788508.9
    // console.log(x,y,target);
    const [_x, _y] = pos([x, y]);
    const [_x2, _y2] = pos([x2, y2]);

    // console.log(_x)

    setPoint(context, type, _x, _y, _x2, _y2);
  });
  context.stroke();
  context.closePath();
  context.restore();
}

function drawPointMarkers(context, points) {
  context.save();
  context.fillStyle = "#fff";
  points.forEach((point) => {
    const [x, y] = point;
    const _x = (x / 10000 - 1640) * 3 - 300;
    const _y = (-y / 10000 - 300) * 3 - 300;

    context.fillRect(_x, _y, 1, 1);
  });

  context.restore();
}

let ii = 10;
// setInterval(function () {
//   ii++;
//   console.log(ii);
// }, 500);

function createZoneLayer(zones) {
  return function drawMap(context) {
    // console.log("render zone");
    /*
    CIR (круг)
    CWA (по часовой стрелке)
    CCA (против часовой стрелки)
    GRC (Большой круг)
    RHL (Рамблайн)
    FNT (географическая граница, т.е. линия, следующая за дорогой и т. Д.)
    */
    zones.forEach(({ points: _points }, index) => {
      if (
        false &&
        ![
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
        ].includes(index)
      )
        return;

      const __points = _points.map(([type, ...coord]) => coord);
      // const [type, ...__points] = _points;
      const loop = true;
      const points = loop ? [...__points, __points[0]] : __points;
      // console.log(points);
      const circles = _points
        .filter(([type]) => ["CIR", "GRC"].includes(type))
        .map(([type, ...coord]) => coord);

      // console.log(circles);
      // drawCircle(context, circles, 10);
      drawPoints(context, TYPES.ZONE, points);

      const arc = _points
        .filter(([type]) => ["CWA"].includes(type))
        .map(([type, ...coord]) => coord);
      context.strokeStyle = "pink";

      drawArc(context, arc, 10, true);

      const arc2 = _points
        .filter(([type]) => ["CCA"].includes(type))
        .map(([type, ...coord]) => coord);
      context.strokeStyle = "yellow";
      drawArc(context, arc2, 10, false);
    });
    // throw 1;

    // drawPoints(
    //   context,
    //   TYPES.CLASS_D,
    //   zone.points.map(([type, ...coord]) => coord)
    // );

    // drawPointMarkers(context, points);

    // edges.forEach((edge, index) => {
    //   const start = point[edge[0]];
    //   const end = point[edge[3]];
    //   console.log(index, start);
    //   drawPoints(context, TYPES.CLASS_D, [start, end]);
    // });

    // drawPointMarkers(context, points);
    // throw 'end';

    // drawPoints(context, TYPES.ACTIVE_FPL, [
    //   [100, 50],
    //   [250, 80],
    //   [400, 150],
    // ]);
    // drawPoints(context, TYPES.NON_ACTIVE_FPL, [
    //   [100, 150],
    //   [250, 180],
    //   [470, 150],
    // ]);

    // drawPoints(context, TYPES.CLASS_B, [
    //   [400, 190],
    //   [550, 120],
    //   [800, 150],
    // ]);

    // drawPoints(context, TYPES.CLASS_C, [
    //   [100, 490],
    //   [150, 420],
    //   [200, 450],
    // ]);

    // drawPoints(context, TYPES.CLASS_D, [
    //   [700, 490],
    //   [750, 420],
    // ]);

    // drawPoints(context, TYPES.RESTRICTED, [
    //   [700, 390],
    //   [750, 320],
    // ]);

    // drawPoints(context, TYPES.OTHER, [
    //   [300, 40],
    //   [250, 320],
    //   [350, 340],
    //   [450, 220],

    // ]);

    // drawPoints(context, TYPES.TFR, [
    //   [500, 690],
    //   [150, 520],
    // ]);

    // drawPoints(context, TYPES.MILITARY, [
    //   [600, 500],
    //   [800, 580],
    //   [900, 350],
    //   [400, 350],
    //   [400, 500],
    // ]);

    // drawPoints(
    //   context,
    //   TYPES.MILITARY,
    //   [
    //     [600, 500],
    //     [800, 580],
    //     [900, 350],
    //     [400, 350],
    //     [400, 500],
    //   ].reverse()
    //);
    context.save();
    context.strokeStyle = "white";
    context.beginPath();
    context.moveTo(camera.offsetX - 10, camera.offsetY);
    context.lineTo(camera.offsetX + 10, camera.offsetY);
    context.moveTo(camera.offsetX, camera.offsetY - 10);
    context.lineTo(camera.offsetX, camera.offsetY + 10);
    context.stroke();
    context.closePath();
    context.restore();
  };
}

export { createZoneLayer };
