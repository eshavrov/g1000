const POSITION = { x: 200, y: 330, width: 70, height: 50 };

const turn = (context, start, r, angle, sx = 2, sy = 1.5) => {
  context.save();
  context.translate(start.x, start.y);
  context.rotate(angle);

  context.fillStyle = context.strokeStyle;
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(r - sx, 0);
  context.lineTo(r - sx, -sy);
  context.lineTo(r, 0);
  context.lineTo(r - sx, sy);
  context.lineTo(r - sx, 0);

  context.fill();
  context.stroke();
  context.closePath();

  context.restore();
};

function createWINDLayer(entry = {}) {
  const { velocityHeadwind = 19, velocitySideWind = 23, direction = 0 } = entry;
  const { x, y, width, height } = POSITION;

  return function drawWIND(context) {
    context.fillStyle = "rgba(0,0,0,0.97)";
    context.strokeStyle = "rgba(255,255,255,0.5)";
    context.font = "16px Arial";

    context.beginPath();
    context.rect(x - 0.5, y - 0.5, width, height);
    context.fill();
    context.stroke();
    context.closePath();
    context.strokeStyle = "rgba(255,255,255,1)";
    context.lineWidth = 2;
    turn(context, { x: x + 26, y: y + 16 }, 20, Math.PI);
    turn(context, { x: x + 16, y: y + 6 }, 20, Math.PI / 2);

    context.fillStyle = "rgba(255,255,255,1)";
    context.textBaseline = "middle";

    context.textAlign = "start";

    context.fillText(velocitySideWind, x + 30, y + 18);
    context.textBaseline = "top";
    context.textAlign = "center";
    context.fillText(velocityHeadwind, x + 16, y + 32);
  };
}

export { createWINDLayer };
