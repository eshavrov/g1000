import {
  TYPES,
  FUNCTION_LINE,
  setLineStyles,
} from "../components/lines/constants.js";
import { pos, camera as c } from "../_camera.js";

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

function drawPoints(context, type, points, camera) {
  context.save();
  setLineStyles(context, type);
  context.fillStyle = "#fff";
  context.beginPath();
  points.forEach((point, index) => {
    const [x, y] = point;
    const setPoint = index === 0 ? startPoint : nextPoint;
    const [_x, _y] = pos([x, y]);

    setPoint(context, type, _x, _y);
  });
  context.stroke();
  context.closePath();
  context.restore();
}

function renderBoundingRect(context, object) {
  if (!object.boundingRect) return;

  const [_x, _y, _x2, _y2] = object.boundingRect;
  const [x, y] = pos([_x, _y]);
  const [x2, y2] = pos([_x2, _y2]);

  context.save();
  context.strokeStyle = "lime";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x2, y);
  context.lineTo(x2, y2);
  context.lineTo(x, y2);
  context.lineTo(x, y);

  context.stroke();
  context.closePath();

  context.restore();
}

function isVisibled(context, object) {
  if (!object.boundingRect) return true;

  const [_left, _top, _right, _bottom] = object.boundingRect;
  const [left, top] = pos([_left, _top]);
  const [right, bottom] = pos([_right, _bottom]);

  const width = context.canvas.width / c.devicePixelRatio;
  const height = context.canvas.height / c.devicePixelRatio;

  if (
    (right < 0 && left < 0) ||
    (bottom < 0 && top < 0) ||
    (left > width && right > width) ||
    (top > height && bottom > height)
  ) {
    return false;
  }

  return true;
}

function renderAirport(context, airport) {
  if (!isVisibled(context, airport)) return;

  if (airport.icao_code && airport.boundingRect) {
    context.fillStyle = "#fff";
    context.textAlign = "center";
    context.font = "18px Arial";

    const [x, y] = pos([
      (airport.boundingRect[0] + airport.boundingRect[2]) / 2,
      airport.boundingRect[3],
    ]);
    if (c.scale <= 1024) context.fillText(airport.icao_code, x, y - 2);
    if (airport.city && c.scale <= 16)
      context.fillText(airport.city, x, y - 20);
  }

  if (c.scale <= 32) {
    airport.figures.forEach((a) => {
      const points = a.loop ? [...a.points, a.points[0]] : a.points;
      drawPoints(context, TYPES.CLASS_D, points);
    });
  }
  if (c.scale <= 1024)
  renderBoundingRect(context, airport);
}

function createAirportsLayer(airports) {
  return function drawAirports(context, camera) {
    // console.log("render drawAirports");

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    airports.forEach((airport) => renderAirport(context, airport, camera));
  };
}

export { createAirportsLayer };
