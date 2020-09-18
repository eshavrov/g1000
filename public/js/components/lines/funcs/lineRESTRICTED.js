function lineRESTRICTED(context, start, x, y) {
  const w = x - start.x;
  const h = y - start.y;
  const ratio = h / w;

  const span = 4;

  if (Math.abs(ratio) <= 1) {
    const dir = w < 0 ? -1 : 1;
    for (let i = 0; i < Math.abs(w / 2); i++) {
      const _x = Math.ceil(start.x + dir * i * 2) + 0.5;
      const _y = Math.ceil(start.y + dir * 2 * i * ratio);
      context.moveTo(_x, _y);
      context.lineTo(_x, _y + dir * span);
    }
  } else {
    const dir = h < 0 ? -1 : 1;
    for (let i = 0; i < Math.abs(h / 2); i++) {
      const _y = Math.ceil(start.y + dir * i * 2) + 0.5;
      const _x = Math.ceil(start.x + (dir * 2 * i) / ratio);
      context.moveTo(_x, _y);
      context.lineTo(_x - dir * span, _y);
    }
  }

  context.moveTo(start.x, start.y + 0.5);
  context.lineTo(x, y + 0.5);
}

export { lineRESTRICTED };