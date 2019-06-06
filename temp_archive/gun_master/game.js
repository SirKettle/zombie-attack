
// draw utils
const drawCircle = ({
    ctx,
    x,
    y,
    radius,
    strokeWidth,
    strokeStyle,
    fillStyle,
}) => {
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

// collision utils

// var c1 = {radius: 20, x: 5, y: 5};
const isCollisionCircles = (c1, c2) => {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return Boolean(distance < c1.radius + c2.radius);
}

// var r1 = {x: 5, y: 5, width: 50, height: 50}
const isCollisionRectangles = (r1, r2) => Boolean(
    r1.x < r2.x + r2.width &&
    r1.x + r1.width > r2.x &&
    r1.y < r2.y + r2.height &&
    r1.y + r1.height > r2.y);

const isCollisionCoordCircle = (x, y, c) => { return false; }
const isCollisionCoordRectangle = (x, y, r) => Boolean(
    x > r.x &&
    x < r.x + r.width &&
    y > r.y &&
    y < r.y + r.height
);

const debugMode = true;
const state = {
    el: {},
    fireCounter: 0,
    lastRenderTimestamp: 0,
    delta: 0,
    mouse: { x:0, y:0 },
    controls: { x:0, y:0 },
    viewPosition: {
        maxX: 0,
        maxY: 0,
        minX: 0,
        minY: 0,
        x: 0,
        y: 0
    },
    zombies: []
};

const settings = {
    weapon: {
        power: 0.5,
        blastRadius: 20
    },
    mouse: {
        speed: 5
    },
    zombie: {
        speed: 0.1
    }
};

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
    x: 2200,
    y: 540,
    width: 187,
    height: 300,
    life: 1,
    hitAreas: [{
        x: 20,
        y: 20,
        width: 90,
        height: 100,
        lifeFactor: 0.9
    }, {
        x: 70,
        y: 120,
        width: 65,
        height: 60,
        lifeFactor: 0.4
    }]
    // background-image: url('assets/images/zombie.gif');
}

const zombieImage = new Image(newZombie.width, newZombie.height);
zombieImage.src = 'assets/images/zombie.png';

function onFireButtonClick () {
    state.fireCounter = state.fireCounter + 1;

    const explosion = document.getElementById('explosion');

    // cross_hair.style.borderColor = 'red';
    explosion.style.opacity = '0.7';
    setTimeout(()=>{
        // cross_hair.style.borderColor = 'white';
        explosion.style.opacity = '0';
    }, 100);

    console.log(state.gameRect);
    const bx = state.gameRect.width/2;
    const by = state.gameRect.height/2;


    state.zombies = state.zombies.map(zombie => {
        const x = zombie.x + state.viewPosition.x;
        const y = zombie.y + state.viewPosition.y;
        return {
           ...zombie,
           life: isCollisionCoordRectangle(bx, by, { x, y, width: zombie.width, height: zombie.height }) ? 0:zombie.life
        }
    });

}

const randomizePerSecond = (cb, delta, frequency = 5000) => {
    if (Math.random() < delta / frequency) {
        cb();
    }
}

function updateState () {
    // Update the state of the world for the elapsed time since last render

    const speedX = state.delta * settings.mouse.speed;
    const speedY = speedX * 0.65;
    const newX = state.viewPosition.x - (state.controls.x * speedX);
    const newY = state.viewPosition.y - (state.controls.y * speedY);
    state.viewPosition.x = Math.max(Math.min(state.viewPosition.maxX, newX), state.viewPosition.minX);
    state.viewPosition.y = Math.max(Math.min(state.viewPosition.maxY, newY), state.viewPosition.minY);

    state.zombies = state.zombies
        .map(zombie => ({ ...zombie, x: zombie.x - settings.zombie.speed * state.delta }))
        .filter(zombie => zombie.life > 0)
        .filter(zombie => zombie.x > -zombie.width);

    randomizePerSecond(addZombie, state.delta, 5000);
}

const addZombie = () => {
    state.zombies = [...state.zombies, newZombie];
}

const drawZombie = zombie => {
    const x = zombie.x + state.viewPosition.x;
    const y = zombie.y + state.viewPosition.y;
    const { width, height } = zombie;
    state.ctx.drawImage(zombieImage, x, y, width, height);

    if (debugMode) {
        state.ctx.strokeStyle = 'red';
        state.ctx.strokeRect(x, y, width, height);

        zombie.hitAreas.forEach(hitArea => {
            state.ctx.strokeRect(x + hitArea.x, y + hitArea.y, hitArea.width, hitArea.height);
        })
    }
}

function draw() {
    // Draw the state of the world
    if (debugMode) {
        const debugEl = document.getElementById('debug');
        debugEl.innerText = `
            delta: ${state.delta.toFixed(3)}
            FPS: ${Math.round(1000/state.delta)}
            fireCounter: ${state.fireCounter}
            x: ${Math.round(state.controls.x * 100)}%
            y: ${Math.round(state.controls.y * 100)}%
            zombies: ${state.zombies.length}
        `;
    }

    state.ctx.clearRect(0, 0, state.gameRect.width, state.gameRect.height);

    // scroll background
    state.el.background.style.left = `${state.viewPosition.x}px`;
    state.el.background.style.top = `${state.viewPosition.y}px`;

    state.zombies.forEach(drawZombie);

    const bx = state.gameRect.width/2;
    const by = state.gameRect.height/2;
    const isOnTarget = state.zombies.some(zombie => {
        const x = zombie.x + state.viewPosition.x;
        const y = zombie.y + state.viewPosition.y;
        return isCollisionCoordRectangle(bx, by, { x, y, width: zombie.width, height: zombie.height });
    });

    // draw weapon sight (and blast radius)
    // state.ctx.(0, 0, 500, 500);
    drawCircle({
        ctx: state.ctx,
        x: state.gameRect.width * 0.5,
        y: state.gameRect.height * 0.5,
        radius: settings.weapon.blastRadius,
        strokeWidth: 2,
        strokeStyle: isOnTarget ? 'red' : 'yellow',
    });
}

function loop(timestamp) {
    //
    state.delta = timestamp - state.lastRenderTimestamp;
    state.lastRenderTimestamp = timestamp;

    updateState();
    draw();


    // and again!
    window.requestAnimationFrame(loop)
}

const onMouseMove = (gameRect) => (e) => {
    const x = e.clientX - gameRect.left - (gameRect.width * 0.5);
    const y = e.clientY - gameRect.top - (gameRect.height * 0.5); //- scroll
    state.mouse = {
        x,
        y,
    }

    const xMove = x / (gameRect.width * 0.5);
    const yMove = y / (gameRect.height * 0.5);
    // if movement less than 20% - stay still
    const staticAreaPercentage = 0.2;
    const rapidAreaPercentage = 0.4;
    state.controls = {
        x: Math.abs(xMove) > staticAreaPercentage ? (Math.abs(xMove) > rapidAreaPercentage ? xMove : xMove * 0.5) : xMove * 0.25,
        y: Math.abs(yMove) > staticAreaPercentage ? (Math.abs(yMove) > rapidAreaPercentage ? yMove : yMove * 0.5) : yMove * 0.25,
    }
}

function onKeydown (e) {
    if (e.code === 'Space') {
        onFireButtonClick();
        e.preventDefault();
        e.stopPropagation();
    }
    return true;
}

function launchGame () {
    // initialize some state values
    state.el.game = document.getElementById('gun_master_game');
    state.gameRect = state.el.game.getBoundingClientRect();
    state.el.background = document.getElementById('background');
    const backgroundRect = state.el.background.getBoundingClientRect();

    state.canvas = document.getElementById('canvas');
    state.canvas.width = state.gameRect.width;
    state.canvas.height = state.gameRect.height;
    state.ctx = state.canvas.getContext('2d');

    state.viewPosition = {
        ...state.viewPosition,
        minX: state.gameRect.width - backgroundRect.width,
        minY: state.gameRect.height - backgroundRect.height,
    };

    addZombie();

    // subscribe to input events
    state.el.game.addEventListener('mousemove', onMouseMove(state.gameRect));
    window.addEventListener('keydown', onKeydown)

    // start the game loop
    window.requestAnimationFrame(loop);
}

window.addEventListener('DOMContentLoaded', launchGame);

