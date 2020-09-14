function renderValue(context, x, y) {
  const s = 9;
  context.fillStyle = "#111";
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + s, y - s);
  context.lineTo(x + s, y - 2 * s);

  context.lineTo(x + 7 * s, y - 2 * s);
  context.lineTo(x + 7 * s, y - 3 * s);
  context.lineTo(x + 10 * s, y - 3 * s);
  context.lineTo(x + 10 * s, y + 3 * s);
  context.lineTo(x + 7 * s, y + 3 * s);
  context.lineTo(x + 7 * s, y + 2 * s);

  context.lineTo(x + s, y + 2 * s);
  context.lineTo(x + s, y + s);
  context.fill();
  context.closePath();
  context.save();
  context.font = "24px Arial";
  context.textBaseline = "middle";
  context.textAlign = "end";

  context.fillStyle = "#fff";
  context.fillText("30", x + 7 * s - 2, y);
  context.restore();
}

function renderValue2(context, x, y, value) {
  const s = 10;
  context.fillStyle = "rgba(10,10,10,0.7)";
  context.strokeStyle = "rgba(255,255,255,0.9)";

  const text = "" + value;
  const metrics = context.measureText(text);
  const width = Math.max(metrics.width, 40);

  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + s, y - s - 0.5);

  context.lineTo(x + width + s + 0.5, y - s - 0.5);
  context.lineTo(x + width + s + 0.5, y + s - 0.5);

  context.lineTo(x + s, y + s - 0.5);
  context.lineTo(x, y);

  context.fill();
  context.stroke();
  context.closePath();
  context.save();
  // context.font = "24px Arial";
  context.textBaseline = "middle";
  context.textAlign = "end";

  context.fillStyle = "#fff";
  context.fillText(text, x + width + s / 2, y + 1);
  context.restore();
}
function renderPanelTrail(
  context,
  x,
  y,
  width,
  height,
  text = "0",
  options = { stroke: "#fff", color: "#3bbebd", fill: "#000" }
) {
  const { stroke, fill, color } = options;
  context.fillStyle = fill;
  context.strokeStyle = stroke;
  context.beginPath();
  context.rect(x, y, width, height);
  context.fill();
  context.stroke();
  context.closePath();

  context.save();
  context.font = "14px Arial";
  context.textBaseline = "middle";
  context.textAlign = "center";

  context.fillStyle = color;
  context.fillText(text, x + width / 2, y + height / 2 + 1);
  context.restore();
}

function renderPanel(context, width, height) {
  context.fillStyle = "rgba(60,60,60,0.3)";
  context.strokeStyle = "rgba(255,255,255,0.5)";
  context.beginPath();
  const yCenter = height / 2;
  const s = 30.5;
  const x = 100;

  context.rect(0.5, 0.5, x - 1, height - 1);
  context.moveTo(x, s);
  context.lineTo(width - 0.5, s);
  context.lineTo(width - 0.5, yCenter - 30);
  context.lineTo(x, yCenter);
  context.lineTo(width - 0.5, yCenter + 30);
  context.lineTo(width - 0.5, height - s);
  context.lineTo(x, height - s);

  context.fill();
  context.stroke();
  context.closePath();

  const h = 28;
  context.fillStyle = "rgba(255,255,255,0.5)";

  for (let i = -4; i <= 4; i++) {
    if (i) {
      const y = yCenter + i * h;
      const span = i % 2 === 0 ? 18 : 10;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + span, y);
      context.stroke();
      context.closePath();
      if (i % 2 === 0) {
        const text = "" + Math.abs((i / 2) << 0);
        context.fillText(text, x + 25, y + 6);
      }
    }
  }

  const value = Math.cos(Date.now() / 3500) * 400;

  context.beginPath();
  for (let line = 150; line--; ) {
    const y = line * 10 + value - 400;
    context.moveTo(0, y);
    context.lineTo(10 + (line % 5 === 0 ? 10 : 0), y);
  }
  context.stroke();
  context.closePath();
  context.fillStyle = "rgba(255,255,255,0.8)";

  for (let line = 30; line--; ) {
    const y = line * 50 + value - 400 + 6;
    const text = 30 - line + "00";
    context.fillText(text, 25, y);
  }

  renderValue(context, 4, yCenter);
  renderValue2(context, x + 1, yCenter + 20, -400);

  renderPanelTrail(context, 0.5, 0.5, x - 1, 23, "0");
  renderPanelTrail(context, 0.5, height - 23.5, x - 1, 23, "29.92IN");
}

function createPanelLayer(entity, width = 160, height = 400) {
  const spriteBuffer = document.createElement("canvas");
  spriteBuffer.width = width;
  spriteBuffer.height = height;
  const spriteBufferContext = spriteBuffer.getContext("2d");
  spriteBufferContext.font = "18px Arial";

  const center = {
    x: 600,
    y: 100,
  };

  return function drawPanel(context) {
    spriteBufferContext.clearRect(0, 0, width, height);

    renderPanel(spriteBufferContext, width, height);

    context.drawImage(spriteBuffer, Math.floor(center.x), Math.floor(center.y));
  };
}

export { createPanelLayer };
