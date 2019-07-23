import sprite from 'assets/images/zombie.png';

export const config = {
  z: 1,
  width: 187,
  height: 300,
  life: 1,
  speed: 0.1,
  hitAreas: [
    // frame 0
    [
      // brain
      {
        x: 35,
        y: 52,
        width: 50,
        height: 40,
        lifeFactor: 0.9,
      },
      // head inner
      {
        x: 25,
        y: 22,
        width: 90,
        height: 100,
        lifeFactor: 0.5,
      },
      // head
      {
        x: 5,
        y: 5,
        width: 120,
        height: 120,
        lifeFactor: 0.1,
      },
      // torso
      {
        x: 65,
        y: 122,
        width: 65,
        height: 60,
        lifeFactor: 0.4,
      },
      // lower
      {
        x: 60,
        y: 170,
        width: 105,
        height: 110,
        lifeFactor: 0.2,
      },
    ],
    // frame 1
    [
      // brain
      {
        x: 35,
        y: 52,
        width: 50,
        height: 40,
        lifeFactor: 0.9,
      },
      // head inner
      {
        x: 25,
        y: 22,
        width: 90,
        height: 100,
        lifeFactor: 0.5,
      },
      // head
      {
        x: 5,
        y: 5,
        width: 120,
        height: 120,
        lifeFactor: 0.1,
      },
      // torso
      {
        x: 65,
        y: 122,
        width: 65,
        height: 60,
        lifeFactor: 0.4,
      },
      // lower
      {
        x: 60,
        y: 170,
        width: 105,
        height: 110,
        lifeFactor: 0.2,
      },
    ],
  ],
  image: {
    sprite,
    frames: [[0, 0], [100, 0], [200, 0]],
    frameRate: 100,
  },
};

// eg zombie state
const initialZombieState = {
  x: 2200,
  y: 540,
  z: 1,
  life: 1,
  currentFrame: 0,
  frameLastChanged: 0,
};

export const zombieSprite = new Image(config.width, config.height);
zombieSprite.src = config.image.sprite;

export const getZombie = () => ({ ...initialZombieState });

export const drawZombie = (ctx, zombie, game, debugMode) => {
  const x = zombie.x + game.scrollPositionX;
  const y = zombie.y + game.scrollPositionY;
  const { width, height, hitAreas } = config;
  ctx.drawImage(zombieSprite, x, y, width, height);

  if (debugMode) {
    ctx.strokeStyle = `rgba(255,0,0,${Math.min(Math.max(zombie.life + 0.3, 0), 1)}`;
    ctx.strokeRect(x, y, width, height);

    hitAreas[zombie.currentFrame].forEach(hitArea => {
      ctx.strokeRect(x + hitArea.x, y + hitArea.y, hitArea.width, hitArea.height);
    });
  }
};
