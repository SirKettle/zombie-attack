export const circle = ({ ctx, x = 0, y = 0, radius = 1, strokeWidth = 1, strokeStyle = 'white', fillStyle = '' }) => {
  // save default ctx state
  ctx.save();

  // set styles
  if (strokeWidth > 0) {
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeStyle;
  }
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
  }

  // path
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.closePath();

  // apply styles
  if (fillStyle) {
    ctx.fill();
  }

  if (strokeWidth > 0) {
    ctx.stroke();
  }

  // restore default ctx state
  ctx.restore();
};

export const line = ({ ctx, from, to, strokeWidth = 1, strokeStyle = 'white' }) => {
  // save default ctx state
  ctx.save();

  ctx.beginPath(); // Start a new path
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();

  // restore default ctx state
  ctx.restore();
};
