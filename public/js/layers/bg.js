export function createBackgroundLayer(color) {
  return function drawColor(context) {
    context.fillStyle = color;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    const angle = Math.sin(Date.now() / 1000) / 10;
    const r = context.canvas.width;
    const center = { x: context.canvas.width / 2, y: 200 };

    context.lineWidth = 2;
    context.fillStyle = "blue";
    context.strokeStyle = "white";

    context.beginPath();
    context.moveTo(-2, -2);

    context.lineTo(
      center.x + r * Math.cos(angle + Math.PI),
      center.y - r * Math.sin(angle + Math.PI)
    );
    context.lineTo(
      center.x + r * Math.cos(angle),
      center.y - r * Math.sin(angle)
    );

    context.lineTo(context.canvas.width + 2, -2);

    context.fill();
    context.stroke();
    context.closePath();
  };
}
