import { airplane } from "../components/airplane.js";

const DIRECTON = [
  "N",
  "3",
  "6",
  "E",
  "12",
  "15",
  "S",
  "21",
  "24",
  "W",
  "30",
  "33",
];

const CIRCLE_LINES = [
  { index: 0, width: 2 },
  { index: 9, width: 2 },
  { index: 27, width: 2 },
  { index: 36, width: 2 },
  { index: 45, width: 2 },
  { index: 50, width: 1 },
  { index: 52, width: 1 },
  { index: 56, width: 1 },
  { index: 58, width: 1 },
  { index: 63, width: 2 },
];

function createDashboardLayer(entity) {
  const center = {
    x: 380,
    y: 460,
  };
  const r = 120;
  const rDirection = r - 26;
  const rInner = r - 42;

  const rr = [-50, -30, 30, 50];
  const r3 = 4;

  function circleInner(context, { center }) {
    context.lineWidth = 1;

    context.beginPath();
    for (let seg = 2 * 36; seg--; ) {
      const angle = (seg * Math.PI) / 36;
      const r1 = r - (seg % 2 === 0 ? 8 : 4);

      context.moveTo(
        center.x + Math.cos(angle) * r1 + 0.5,
        center.y + Math.sin(angle) * r1
      );
      context.lineTo(
        center.x + Math.cos(angle) * r + 0.5,
        center.y + Math.sin(angle) * r
      );
    }
    context.stroke();
    context.closePath();

    context.font = "18px Arial";

    for (let seg = 12; seg--; ) {
      context.save();

      const text = DIRECTON[seg];
      const metrics = context.measureText(text);

      const angle = (seg * Math.PI) / 6;

      context.translate(
        center.x + rDirection * Math.cos(angle),
        center.y + rDirection * Math.sin(angle)
      );
      context.rotate(angle + Math.PI / 2);
      context.fillText(text, -metrics.width / 2, 0);
      context.restore();
    }
  }

  return function drawDashboard(context) {
    context.fillStyle = "white";
    context.strokeStyle = "white";
    context.lineWidth = 1;
    const angleLine = Math.sin(Date.now() / 1600);
    const angleInner = Math.cos(Date.now() / 1000);

    context.beginPath();
    context.rect(center.x, center.y, 2, 2);
    context.fill();
    context.closePath();

    context.beginPath();
    CIRCLE_LINES.forEach(({ index: seg, width }) => {
      const angle = (seg * Math.PI) / 36;
      const rOut = r + 16;
      const rOutStart = r + 4;
      context.lineWidth = width;
      context.beginPath();

      context.moveTo(
        center.x + Math.cos(angle) * rOutStart,
        center.y + Math.sin(angle) * rOutStart
      );
      context.lineTo(
        center.x + Math.cos(angle) * rOut,
        center.y + Math.sin(angle) * rOut
      );
      context.stroke();
      context.closePath();
    });

    context.lineWidth = 1;
    context.beginPath();
    context.arc(center.x, center.y, rInner, 0, 2 * Math.PI);
    context.stroke();
    context.closePath();

    context.beginPath();
    rr.forEach((r) => {
      context.moveTo(
        center.x + Math.cos(angleLine) * r + r3,
        center.y - Math.sin(angleLine) * r
      );

      context.arc(
        center.x + Math.cos(angleLine) * r,
        center.y - Math.sin(angleLine) * r,
        r3,
        0,
        2 * Math.PI
      );
    });
    context.stroke();
    context.closePath();

    context.beginPath();
    airplane(context, center);
    context.fill();

    context.closePath();

    context.save();
    context.translate(center.x, center.y);
    context.rotate(angleInner);

    circleInner(context, {
      angleLine,
      center: { x: 0, y: 0 },
    });
    context.restore();
  };
}

export { createDashboardLayer };
