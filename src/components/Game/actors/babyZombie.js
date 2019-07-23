import * as draw from 'utils/draw';

import walk0 from 'assets/images/baby-zombie/walk/00.png';
import walk1 from 'assets/images/baby-zombie/walk/01.png';
import walk2 from 'assets/images/baby-zombie/walk/02.png';
import walk3 from 'assets/images/baby-zombie/walk/03.png';
import walk4 from 'assets/images/baby-zombie/walk/04.png';
import walk5 from 'assets/images/baby-zombie/walk/05.png';
import walk6 from 'assets/images/baby-zombie/walk/06.png';
import walk7 from 'assets/images/baby-zombie/walk/07.png';

const hitAreas = [
  // head
  {
    x: 0.5,
    y: 0.35,
    r: 0.35,
    lifeFactor: 0.5,
  },
  // brain
  {
    x: 0.5,
    y: 0.35,
    r: 0.2,
    lifeFactor: 0.5,
  },
  // body
  {
    x: 0.5,
    y: 0.75,
    r: 0.25,
    lifeFactor: 0.25,
  },
  // hand
  {
    x: 0.85,
    y: 0.75,
    r: 0.1,
    lifeFactor: 0.25,
  },
];

const imageDimensions = {
  width: 370,
  height: 380,
};

export const config = {
  z: 1,
  width: imageDimensions.width * 0.5,
  height: imageDimensions.height * 0.5,
  life: 1,
  speed: 0.1,
  hitAreas: [
    hitAreas.slice(),
    hitAreas.slice(),
    hitAreas.slice(),
    hitAreas.slice(),
    hitAreas.slice(),
    hitAreas.slice(),
    hitAreas.slice(),
    hitAreas.slice(),
  ],
  image: {
    frames: [],
    frameRate: 100,
  },
};

const walk0Sprite = new Image();
const walk1Sprite = new Image();
const walk2Sprite = new Image();
const walk3Sprite = new Image();
const walk4Sprite = new Image();
const walk5Sprite = new Image();
const walk6Sprite = new Image();
const walk7Sprite = new Image();
walk0Sprite.src = walk0;
walk1Sprite.src = walk1;
walk2Sprite.src = walk2;
walk3Sprite.src = walk3;
walk4Sprite.src = walk4;
walk5Sprite.src = walk5;
walk6Sprite.src = walk6;
walk7Sprite.src = walk7;

config.image.frames = [
  walk0Sprite,
  walk1Sprite,
  walk2Sprite,
  walk3Sprite,
  walk4Sprite,
  walk5Sprite,
  walk6Sprite,
  walk7Sprite,
];

// eg zombie state
const initialZombieState = {
  x: -config.width,
  y: 600,
  z: 1,
  life: 1,
  currentFrame: 0,
  frameLastChanged: 0,
};

export const getZombie = () => ({
  ...initialZombieState,
  z: Math.random() * 1 + 0.5,
  y: Math.random() * 50 + initialZombieState.y,
  speed: Math.random() * 0.3 + 0.1,
});

export const getHitAreaCircle = (scrollX, scrollY, z, outerRect, hitArea) => ({
  x: hitArea.x * outerRect.width * z + scrollX,
  y: hitArea.y * outerRect.height * z + scrollY,
  radius: hitArea.r * outerRect.width * z,
});

export const drawZombie = (ctx, zombie, game, debugMode) => {
  const x = zombie.x + game.scrollPositionX;
  const y = zombie.y + game.scrollPositionY;
  const { z } = zombie;
  const { width, height, hitAreas } = config;
  ctx.drawImage(
    config.image.frames[zombie.currentFrame],
    40,
    25,
    imageDimensions.width,
    imageDimensions.height,
    x,
    y,
    width * zombie.z,
    height * zombie.z,
  );
  // ctx.drawImage(config.image.frames[zombie.currentFrame], x, y, width, height);

  if (debugMode) {
    const strokeStyle = `rgba(255,0,0,${Math.min(Math.max(zombie.life + 0.3, 0), 1)}`;
    ctx.strokeStyle = strokeStyle;
    ctx.strokeRect(x, y, width * z, height * z);

    hitAreas[zombie.currentFrame].forEach(hitArea => {
      draw.circle({
        ctx,
        // x: hitArea.x * config.width + x,
        // y: hitArea.y * config.height + y,
        // radius: hitArea.r * config.width,
        ...getHitAreaCircle(x, y, z, config, hitArea),
        strokeStyle,
      });
    });
  }
};
