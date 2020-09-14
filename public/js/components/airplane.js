const airplane = (context, { x, y }) => {
  const s = 2;

  context.moveTo(x - s, y);
  context.lineTo(x - 6 * s, y);
  context.lineTo(x - 6 * s, y - s);
  context.lineTo(x - s, y - 3 * s);

  context.arc(x, y - 6 * s, s, Math.PI, 2 * Math.PI);

  context.lineTo(x + s, y - 3 * s);
  context.lineTo(x + 6 * s, y - s);
  context.lineTo(x + 6 * s, y);
  context.lineTo(x + s, y);
  context.lineTo(x + s, y + 3 * s);
  context.lineTo(x + s * 2, y + 4 * s);
  context.lineTo(x + s * 2, y + 5 * s);
  context.lineTo(x - s * 2, y + 5 * s);
  context.lineTo(x - s * 2, y + 4 * s);
  context.lineTo(x - s, y + 3 * s);
};

export { airplane };
