export class Vec2 {
  constructor(x, y) {
    this.set(x, y);
  }

  copy(vec2) {
    this.x = vec2.x;
    this.y = vec2.y;
  }

  equals(vec2) {
    return this.x === vec2.x && this.y === vec2.y;
  }

  distance(v) {
    const dx = this.x - v.x,
      dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }
}

export function clamp(value, min, max) {
  if (value > max) {
    return max;
  }
  if (value < min) {
    return min;
  }
  return value;
}

export const Direction = {
  UP: new Vec2(0, -1),
  DOWN: new Vec2(0, 1),
  RIGHT: new Vec2(1, 0),
  LEFT: new Vec2(-1, 0),
};
