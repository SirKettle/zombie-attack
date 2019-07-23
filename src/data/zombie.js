export default {
  z: 1,
  width: 187,
  height: 300,
  life: 1,
  hitAreas: [
    // frame 0
    [
      // head
      {
        x: 20,
        y: 20,
        width: 90,
        height: 100,
        lifeFactor: 0.9,
      },
      // torso
      {
        x: 70,
        y: 120,
        width: 65,
        height: 60,
        lifeFactor: 0.4,
      },
    ],
  ],
  image: {
    src: 'assets/images/zombie.png',
    sprite: 'assets/images/zombie-sprite.png',
    frames: [[0, 0], [100, 0], [200, 0]],
    frameRate: 100,
  },
};

// eg zombie state
const exampleZombieState = {
  x: 2200,
  y: 540,
  z: 1,
  life: 1,
  currentFrame: 0,
};

// const zombieImage = new Image(newZombie.width, newZombie.height);
// zombieImage.src = 'assets/images/zombie.png';
