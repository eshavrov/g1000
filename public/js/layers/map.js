import {
  TYPES,
  FUNCTION_LINE,
  setLineStyles,
} from "../components/lines/constants.js";
import { lngLatToMeters } from "../utils/mercator.js";
import {  camera, pos } from "../camera.js";


let target = {};

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

function drawPoints(context, type, points) {
  context.save();
  setLineStyles(context, type);
  context.fillStyle = "#fff";
  context.beginPath();
  points.forEach((point, index) => {
    const [x, y] = point;
    const setPoint = index === 0 ? startPoint : nextPoint;
    // const _x = (x / 10000 - 1640) * 3 - 300;
    // const _y = (-y / 10000 - 300) * 3 - 300;

    // 19688717.1, -4788508.9

    const [_x,_y] = pos([x,y]);

    // console.log(_x)

    setPoint(context, type, _x, _y);
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

function createMapLayer(airports, points, point, edges, entry = {}) {
  const airport = airports[108];
  const [x, y] = lngLatToMeters([airport.datum_lon, airport.datum_lat]);
  target = { x, y };
  camera.x = x;
  camera.y = y;

  return function drawMap(context) {
    airport.figures.forEach((a) => {
      const points = a.loop ? [...a.points, a.points[0]] : a.points;
      drawPoints(context, TYPES.CLASS_D, points);
    });

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
  };
}

export { createMapLayer };
