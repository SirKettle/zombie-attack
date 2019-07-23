import * as React from 'react';
import styled from 'styled-components';
import { add } from 'ramda';
import { default as GameCanvas } from '../Canvas';
import backgroundImage from 'assets/images/background.jpg';
import * as collision from 'utils/collision';
import { shouldPerSecond } from 'utils/random';
import { getZombie, drawZombie, config as zombieConfig, getHitAreaCircle } from './actors/babyZombie';
import { drawSights } from './actors/sights';
import { drawWeapon, getCurrentWeapon } from './actors/weapon';
import { play as playAudio, toggleMusic } from 'utils/audio';

const GameWrapper = styled.div``;

// TODO: move to seperate component
const Debug = styled.div`
  font-size: 11px;
  font-family: monospace;
  color: greenyellow;
`;

const GameFrame = styled.div`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  border-radius: 50%;
`;

const Background = styled.div`
  position: absolute;
  z-index: 0;
  width: 4500px;
  height: 1200px;
  background-size: cover;
  background-position: center bottom;
  background-image: url(${backgroundImage});
`;

const gameRef = React.createRef();
const backgroundRef = React.createRef();
const canvasRef = React.createRef();

const settings = {
  updateInfoFrequency: 1000, // time between rendering (score / info)
  mouse: {
    speed: 5,
    stabiliseMode: false,
  },
  debugMode: false,
};

export class Game extends React.Component {
  state = {
    delta: 0,
    ctx: null,
    game: {
      width: 700,
      height: 700,
      mouse: { x: 0, y: 0 },
      controls: { x: 0, y: 0 },
      scrollPositionExtremes: {
        maxX: 0,
        maxY: 0,
        minX: 0,
        minY: 0,
      },
      scrollPositionX: 0,
      scrollPositionY: 0,
      zombies: [],
      target: { near: false, lifeFactor: 0 },
      weapons: ['bigGun', 'sniper'],
      currentWeaponIndex: 1,
    },
    prevLoopTimestamp: 0,
    infoUpdatedTime: 0,
    timeElapsed: 0,
  };

  shouldComponentUpdate(_nextProps, nextState, _nextContext) {
    if (this.state.infoUpdatedTime !== nextState.infoUpdatedTime) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown, true);

    if (gameRef.current) {
      gameRef.current.removeEventListener('mousemove', this.handleMouseMove, true);
    }
  }

  componentDidMount() {
    if (!gameRef.current || !canvasRef.current || !backgroundRef.current) {
      throw new Error('Missing refs to dom elements');
    }
    const { game } = this.state;

    // initialize some state values
    const backgroundRect = backgroundRef.current.getBoundingClientRect();
    const gameRect = gameRef.current.getBoundingClientRect();

    canvasRef.current.width = gameRect.width;
    canvasRef.current.height = gameRect.height;

    this.setState(
      {
        ctx: canvasRef.current.getContext('2d'),
        game: {
          ...game,
          scrollPositionExtremes: {
            minX: gameRect.width - backgroundRect.width,
            minY: gameRect.height - backgroundRect.height,
            maxX: 0,
            maxY: 0,
          },
          zombies: [...game.zombies, getZombie()],
        },
      },
      () => {
        // subscribe to input events
        window.addEventListener('keydown', this.handleKeyDown, true);
        gameRef.current.addEventListener('mousemove', this.handleMouseMove, true);

        // start the game loop
        window.requestAnimationFrame(this.loop);
      },
    );
  }

  render() {
    // const { id } = this.props;
    console.log('render game');
    return (
      <GameWrapper>
        <GameFrame
          id={this.state.lastUpdate}
          ref={gameRef}
          width={this.state.game.width}
          height={this.state.game.height}
        >
          <Background ref={backgroundRef} />
          <GameCanvas ref={canvasRef} width={this.state.game.width} height={this.state.game.height} />;
        </GameFrame>
        {settings.debugMode ? (
          <Debug>
            <p>Time: {Math.floor(this.state.timeElapsed * 0.001)}s</p>
            <p>
              {this.state.delta > 0
                ? `Delta: ${this.state.delta.toFixed(2)}ms, FPS: ${Math.round(1000 / this.state.delta)}`
                : '...'}
            </p>
          </Debug>
        ) : null}
      </GameWrapper>
    );
  }

  updateState = () => {
    // Update the state of the world for the elapsed time since last render
    const { ctx, delta, game } = this.state;

    if (!ctx) {
      return;
    }

    // update scroll position
    const speedX = delta * settings.mouse.speed;
    const speedY = speedX * 0.65;
    const newX = game.scrollPositionX - game.controls.x * speedX;
    const newY = game.scrollPositionY - game.controls.y * speedY;
    const scrollPositionX = Math.max(
      Math.min(game.scrollPositionExtremes.maxX, newX),
      game.scrollPositionExtremes.minX,
    );
    const scrollPositionY = Math.max(
      Math.min(game.scrollPositionExtremes.maxY, newY),
      game.scrollPositionExtremes.minY,
    );

    // update weapon sight
    const weaponTarget = {
      x: game.width / 2,
      y: game.height / 2,
    };
    const weapon = getCurrentWeapon(game);
    const isNearHit = game.zombies.some(zombie => {
      const zombieX = zombie.x + game.scrollPositionX;
      const zombieY = zombie.y + game.scrollPositionY;

      return collision.isCollisionCoordRectangle(weaponTarget.x, weaponTarget.y, {
        x: zombieX,
        y: zombieY,
        width: zombieConfig.width,
        height: zombieConfig.height,
      });
    });

    const lifeFactorTargeted = game.zombies
      .map(zombie => {
        const zombieX = zombie.x + game.scrollPositionX;
        const zombieY = zombie.y + game.scrollPositionY;

        return zombieConfig.hitAreas[zombie.currentFrame]
          .map(hitArea => {
            const isCollision = collision.isCollisionCircles(
              {
                ...weaponTarget,
                radius: weapon.blastRadius,
              },
              getHitAreaCircle(zombieX, zombieY, zombie.z, zombieConfig, hitArea),
            );
            return isCollision ? hitArea.lifeFactor : 0;
          })
          .reduce(add, 0);
      })
      .reduce(add, 0);

    const isNewZombie = shouldPerSecond(delta, 5000);
    const { frameRate, frames } = zombieConfig.image;
    const zombies = game.zombies
      .map(zombie => {
        const isFrameChange = zombie.frameLastChanged + delta >= frameRate;
        return {
          ...zombie,
          x: zombie.x + zombie.speed * delta,
          z: zombie.z + delta / 20000 / zombie.speed,
          frameLastChanged: isFrameChange ? 0 : zombie.frameLastChanged + delta,
          currentFrame: isFrameChange
            ? zombie.currentFrame >= frames.length - 2
              ? 0
              : zombie.currentFrame + 1
            : zombie.currentFrame,
        };
      })
      .filter(zombie => zombie.life > 0)
      .filter(zombie => zombie.x < backgroundRef.current.getBoundingClientRect().width);

    // update the state
    this.setState(
      {
        game: {
          ...game,
          scrollPositionX,
          scrollPositionY,
          target: {
            near: isNearHit,
            lifeFactor: lifeFactorTargeted,
          },
          zombies: isNewZombie ? zombies.concat(getZombie()) : zombies,
        },
      },
      this.draw,
    );
  };

  draw = () => {
    // Draw the state of the world
    const { ctx, game } = this.state;

    // wipe canvas
    ctx.clearRect(0, 0, game.width, game.height);

    // scroll background - should we make this part of the canvas?
    backgroundRef.current.style.left = `${game.scrollPositionX}px`;
    backgroundRef.current.style.top = `${game.scrollPositionY}px`;
    game.zombies.forEach(zombie => drawZombie(ctx, zombie, game, settings.debugMode));

    // draw weapon sight (using blast radius)
    drawSights(ctx, game);
    drawWeapon(ctx, game);
  };

  loop = timestamp => {
    const delta = timestamp - this.state.prevLoopTimestamp;
    const shouldUpdateInfo = Boolean(timestamp >= this.state.infoUpdatedTime + settings.updateInfoFrequency);
    this.setState(
      {
        infoUpdatedTime: shouldUpdateInfo ? timestamp : this.state.infoUpdatedTime,
        prevLoopTimestamp: timestamp,
        timeElapsed: this.state.timeElapsed + delta,
        delta,
      },
      this.updateState,
    );

    // and again!
    window.requestAnimationFrame(this.loop);
  };

  handleKeyDown = e => {
    const { game } = this.state;
    console.log(e.code);
    if (e.code === 'Space') {
      this.onFireButtonClick();
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.code === 'KeyW') {
      const nextWeaponIndex = game.currentWeaponIndex + 1;
      this.setState({
        game: {
          ...game,
          currentWeaponIndex: nextWeaponIndex >= game.weapons.length ? 0 : nextWeaponIndex,
        },
      });
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.code === 'KeyD') {
      settings.debugMode = !settings.debugMode;
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.code === 'KeyS') {
      settings.mouse.stabiliseMode = !settings.mouse.stabiliseMode;
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.code === 'KeyM') {
      toggleMusic('music');
      e.preventDefault();
      e.stopPropagation();
    }
    return true;
  };

  handleMouseMove = e => {
    if (e.defaultPrevented || !gameRef.current) {
      // Do nothing if the event was already processed
      return;
    }
    const { game } = this.state;
    const gameRect = gameRef.current.getBoundingClientRect();

    const x = e.clientX - gameRect.left - gameRect.width * 0.5;
    const y = e.clientY - gameRect.top - gameRect.height * 0.5; //- scroll

    const xMove = x / (gameRect.width * 0.5);
    const yMove = y / (gameRect.height * 0.5);
    // if movement less than 20% - stay still
    const staticAreaPercentage = 0.2;
    const rapidAreaPercentage = 0.4;

    this.setState({
      game: {
        ...game,
        mouse: {
          x,
          y,
        },
        controls: {
          x: settings.mouse.stabiliseMode
            ? Math.abs(xMove) > staticAreaPercentage
              ? Math.abs(xMove) > rapidAreaPercentage
                ? xMove
                : xMove * 0.5
              : xMove * 0.25
            : xMove,
          y: settings.mouse.stabiliseMode
            ? Math.abs(yMove) > staticAreaPercentage
              ? Math.abs(yMove) > rapidAreaPercentage
                ? yMove
                : yMove * 0.5
              : yMove * 0.25
            : yMove,
        },
      },
    });

    // console.log('mousemove', event);
  };

  onFireButtonClick = () => {
    // state.fireCounter = state.fireCounter + 1;
    //
    // const explosion = document.getElementById('explosion');
    //
    // // cross_hair.style.borderColor = 'red';
    // explosion.style.opacity = '0.7';
    // setTimeout(()=>{
    //   // cross_hair.style.borderColor = 'white';
    //   explosion.style.opacity = '0';
    // }, 100);

    const { game } = this.state;
    const weapon = getCurrentWeapon(game);

    if (!weapon) {
      console.warn('no weapon!!');
      return;
    }

    const weaponTarget = {
      x: game.width / 2,
      y: game.height / 2,
    };

    const zombies = game.zombies.map(zombie => {
      const zombieX = zombie.x + game.scrollPositionX;
      const zombieY = zombie.y + game.scrollPositionY;

      const lifeLost =
        zombieConfig.hitAreas[zombie.currentFrame]
          .map(hitArea => {
            const isCollision = collision.isCollisionCircles(
              {
                ...weaponTarget,
                radius: weapon.blastRadius,
              },
              getHitAreaCircle(zombieX, zombieY, zombie.z, zombieConfig, hitArea),
            );

            return isCollision ? hitArea.lifeFactor : 0;
          })
          .reduce(add, 0) * weapon.power;

      const life = zombie.life - lifeLost;

      if (lifeLost > 0) {
        if (life <= 0) {
          playAudio('zombieDying');
        } else {
          setTimeout(() => {
            playAudio('zombieMeh');
          }, 200);
        }
      }

      return {
        ...zombie,
        life,
      };
    });

    this.setState({
      game: {
        ...game,
        zombies,
      },
    });

    playAudio(weapon.id);
  };
}
