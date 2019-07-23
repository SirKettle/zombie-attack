import * as draw from 'utils/draw';
import { getCurrentWeapon } from './weapon';

export const drawSightLines = (ctx, game, distance, size, color) => {
  draw.line({
    ctx,
    from: { x: game.width * 0.5 + distance, y: game.height * 0.5 - size * 0.5 },
    to: { x: game.width * 0.5 + distance, y: game.height * 0.5 + size * 0.5 },
    strokeStyle: color,
  });
  draw.line({
    ctx,
    from: { x: game.width * 0.5 - distance, y: game.height * 0.5 - size * 0.5 },
    to: { x: game.width * 0.5 - distance, y: game.height * 0.5 + size * 0.5 },
    strokeStyle: color,
  });
  draw.line({
    ctx,
    from: { x: game.width * 0.5 - size * 0.5, y: game.height * 0.5 + distance },
    to: { x: game.width * 0.5 + size * 0.5, y: game.height * 0.5 + distance },
    strokeStyle: color,
  });
  draw.line({
    ctx,
    from: { x: game.width * 0.5 - size * 0.5, y: game.height * 0.5 - distance },
    to: { x: game.width * 0.5 + size * 0.5, y: game.height * 0.5 - distance },
    strokeStyle: color,
  });
};

export const drawSightCenterLines = (ctx, game, weapon, distance) => {
  const innerSightMin = Math.min(weapon.blastRadius, 10);
  const innerSightMax = Math.max(innerSightMin * 3, distance);
  const strokeStyle = `rgba(255,255,255,0.2)`;
  const centralStrokeStyle = `rgba(255,255,255,0.5)`;
  draw.line({
    ctx,
    from: { x: game.width * 0.5 + innerSightMax, y: game.height * 0.5 },
    to: { x: game.width, y: game.height * 0.5 },
    strokeStyle,
  });
  draw.line({
    ctx,
    from: { x: game.width * 0.5 - innerSightMax, y: game.height * 0.5 },
    to: { x: -game.width, y: game.height * 0.5 },
    strokeStyle,
  });
  draw.line({
    ctx,
    from: { x: game.width * 0.5, y: game.height * 0.5 + innerSightMax },
    to: { x: game.width * 0.5, y: game.height },
    strokeStyle,
  });
  draw.line({
    ctx,
    from: { x: game.width * 0.5, y: game.height * 0.5 - innerSightMax },
    to: { x: game.width * 0.5, y: -game.height },
    strokeStyle,
  });
  draw.line({
    ctx,
    from: { x: game.width * 0.5, y: game.height * 0.5 - innerSightMin },
    to: { x: game.width * 0.5, y: game.height * 0.5 - innerSightMax },
    strokeStyle: centralStrokeStyle,
  });
  draw.line({
    ctx,
    from: { x: game.width * 0.5, y: game.height * 0.5 + innerSightMin },
    to: { x: game.width * 0.5, y: game.height * 0.5 + innerSightMax },
    strokeStyle: centralStrokeStyle,
  });
  draw.line({
    ctx,
    from: { x: game.width * 0.5 - innerSightMin, y: game.height * 0.5 },
    to: { x: game.width * 0.5 - innerSightMax, y: game.height * 0.5 },
    strokeStyle: centralStrokeStyle,
  });
  draw.line({
    ctx,
    from: { x: game.width * 0.5 + innerSightMin, y: game.height * 0.5 },
    to: { x: game.width * 0.5 + innerSightMax, y: game.height * 0.5 },
    strokeStyle: centralStrokeStyle,
  });
};

export const drawSights = (ctx, game) => {
  const weapon = getCurrentWeapon(game);
  if (!weapon) {
    return;
  }
  const { blastRadius } = weapon;
  const opacity = 0.7 + game.target.lifeFactor * 0.25;
  const green = game.target.lifeFactor > 0 ? 200 + 155 * game.target.lifeFactor : 100;
  const sightColor = `rgba(100, ${Math.round(Math.max(0, Math.min(255, green)))}, 100, ${opacity})`;

  drawSightCenterLines(ctx, game, weapon, 25);
  drawSightLines(ctx, game, 50 + blastRadius, 20, sightColor);
  drawSightLines(ctx, game, 70 + blastRadius, 35, sightColor);
  drawSightLines(ctx, game, 90 + blastRadius, 50, sightColor);

  draw.circle({
    ctx,
    x: game.width * 0.5,
    y: game.height * 0.5,
    radius: blastRadius, // + game.target.lifeFactor * 10,
    strokeWidth: 2,
    strokeStyle: sightColor, // game.target.direct ? 'greenyellow' : game.target.near ? 'yellow' : 'white',
  });

  draw.circle({
    ctx,
    x: game.width * 0.5,
    y: game.height * 0.5,
    radius: game.width * 0.2 + blastRadius, // + game.target.lifeFactor * 10,
    strokeWidth: game.target.near ? 2 : 1,
    strokeStyle: 'rgba(255,255,255,0.15)', // game.target.direct ? 'greenyellow' : game.target.near ? 'yellow' : 'white',
  });
};
