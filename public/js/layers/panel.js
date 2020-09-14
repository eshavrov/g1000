function renderPanel(context, width, height) {
  context.fillStyle = "rgba(0,0,0,0.4)";
  context.strokeStyle = "white";
  context.beginPath();
  const yCenter = height / 2;
  const s = 30;

  context.rect(0, 0, 100, height);
  context.moveTo(100, s);
  context.lineTo(width, s);
  context.lineTo(width, yCenter - 30);
  context.lineTo(100, yCenter);
  context.lineTo(width, yCenter + 30);
  context.lineTo(width, height - s);
  context.lineTo(100, height - s);

  context.fill();
  context.stroke();
  context.closePath();

  const value = Math.cos(Date.now() / 3500) * 400;

  context.beginPath();
  for (let line = 150; line--; ) {
    const y = line * 10 + value - 400;
    context.moveTo(0, y);
    context.lineTo(10 + (line % 5 === 0 ? 10 : 0), y);
  }
  context.stroke();
  context.closePath();
  context.fillStyle = "white";

  for (let line = 30; line--; ) {
    const y = line * 50 + value - 400 + 6;
    const text = 30 - line + "00";
    context.fillText(text, 25, y);
  }
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
