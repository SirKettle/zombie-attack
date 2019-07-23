import gunImageSrc from 'assets/images/gun.png';
import bigGunImageSrc from 'assets/images/big-gun.png';

const config = [
  {
    id: 'sniper',
    originalWidth: 756,
    originalHeight: 446,
    scale: 0.7,
    xOffset: 80,
    power: 1,
    blastRadius: 3,
    src: gunImageSrc,
  },
  {
    id: 'bigGun',
    originalWidth: 721,
    originalHeight: 467,
    scale: 0.7,
    xOffset: 180,
    power: 0.5,
    blastRadius: 20,
    src: bigGunImageSrc,
  },
];

const loadImage = w => {
  const image = new Image(w.width, w.height);
  image.src = w.src;
  return {
    ...w,
    image,
  };
};

export const weapons = config.map(loadImage);

export const getCurrentWeapon = game => weapons.find(g => g.id === game.weapons[game.currentWeaponIndex]);

export const drawWeapon = (ctx, game) => {
  const weapon = getCurrentWeapon(game);
  const { image, originalWidth, originalHeight, scale, xOffset } = weapon;
  const width = originalWidth * scale;
  const height = originalHeight * scale;
  ctx.drawImage(
    image,
    0,
    0,
    originalWidth,
    originalHeight,
    game.width - width + xOffset,
    game.height - height,
    width,
    height,
  );
};
