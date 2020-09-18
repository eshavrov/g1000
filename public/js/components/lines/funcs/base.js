function lineBase(context, start, x, y, xc, yc) {
  if (xc == null) {
    context.lineTo(x, y + 0.5);
  } else {
    context.quadraticCurveTo(x, y + 0.5, xc, yc);
  }
}

export { lineBase };
