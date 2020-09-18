function lineZone(context, start, x, y, x2, y2) {
  if (!x2) {
    context.lineTo(x, y + 0.5);
  } else {
    context.lineTo(x, y + 0.5);
    context.lineTo(x2, y2 + 0.5);
  }
}

export { lineZone };
