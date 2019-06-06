

// interface Target {
//     offsetX: number; // center or left?
//     offsetY: number; // center or top?
//     width: number;
//     height: number;
//     lifeFactor: number; // 0 - 1 - ie Brain would be 1, finger would be 0.1
// }
//
// interface Thing {
//     x: number; // center or left?
//     y: number; // center or top?
//     width: number;
//     height: number;
//     hitAreas: Array<Target>;
//     life: number;
// }
//
// interface Weapon {
//     power: number; // removed from life (ie life - power * lifeFactor),
//     hitRadius: number; // hit area
// }

const newZombie = {
    life: 1,
    x: 2200,
    y: 540,
    width: 187,
    height: 300,
    // background-image: url('assets/images/zombie.gif');
}

const zombieImage = new Image(newZombie.width, newZombie.height);
zombieImage.src = 'assets/images/zombie.png';


function addZombie(zombies) {
    state.zombies = [...zombies, newZombie];
}

function drawZombie (z) {
    state.ctx.drawImage(zombieImage, z.x + state.viewPosition.x, z.y + state.viewPosition.y, z.width, z.height);
}


// Collision detection, first check for main hit area (the whole sprite), if within the main sprite, check for the individual hitAreas
