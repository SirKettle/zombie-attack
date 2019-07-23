import musicSrc from 'assets/audio/music/eastern-arctic-dubstep.mp3';
import rifleSrc from 'assets/audio/weapon/rifle.ogg';
import bigGunSrc from 'assets/audio/weapon/glauncher3.ogg';
import zombieDyingSrc from 'assets/audio/zombie/zombie-16.wav';
import zombieMehSrc from 'assets/audio/zombie/zombie-22.wav';

// for cross browser compatibility
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

export async function getFile(filepath) {
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  return audioBuffer;
}
// function to call each file and return an array of decoded files
export async function loadFile(filePath) {
  const track = await getFile(filePath);
  return track;
}

function getBufferSource(audioBuffer) {
  const trackSource = audioCtx.createBufferSource();
  trackSource.buffer = audioBuffer;
  trackSource.connect(audioCtx.destination);
  return trackSource;
}

// create a buffer, plop in data, connect and play -> modify graph here if required
export function playSfx(audioBuffer) {
  if (!audioBuffer) {
    console.warn('track not loaded');
    return;
  }
  const trackSource = getBufferSource(audioBuffer);
  trackSource.start();
  return trackSource;
}

const sfxLibrary = [
  { id: 'sniper', src: rifleSrc },
  { id: 'bigGun', src: bigGunSrc },
  { id: 'zombieDying', src: zombieDyingSrc },
  { id: 'zombieMeh', src: zombieMehSrc },
];

sfxLibrary.forEach(t => {
  loadFile(t.src).then(audioBuffer => {
    t.audioBuffer = audioBuffer;
  });
});

export const play = id => {
  const track = sfxLibrary.find(t => t.id === id);
  playSfx(track.audioBuffer);
};

const musicLibrary = [{ id: 'music', src: musicSrc }];

musicLibrary.forEach(t => {
  loadFile(t.src).then(audioBuffer => {
    t.audioBuffer = audioBuffer;
  });
});

export const toggleMusic = id => {
  const track = musicLibrary.find(t => t.id === id);
  if (track.bufferSource) {
    stopMusic(id);
  } else {
    playMusic(id);
  }
};

export const playMusic = (id, loop = true) => {
  const track = musicLibrary.find(t => t.id === id);
  track.bufferSource = getBufferSource(track.audioBuffer);
  track.bufferSource.loop = loop;
  track.bufferSource.start();
};

export const stopMusic = id => {
  const track = musicLibrary.find(t => t.id === id);
  if (!track.bufferSource) {
    console.log('no bufferSource');
    return;
  }
  track.bufferSource.stop();
  delete track.bufferSource;
};

export class Music {
  constructor(props) {
    this.props = props;
    this.start();
  }

  play = () => {
    console.log('play');
  };

  pause = () => {
    console.log('pause');
  };

  setVolume = volume => {
    console.log('setVolume', volume);
  };

  increaseTempo = () => {
    console.log('increaseTempo');
  };

  decreaseTempo = () => {
    console.log('decreaseTempo');
  };

  addLayer = () => {
    console.log('addLayer');
  };

  removeLayer = () => {
    console.log('removeLayer');
  };
}

export class SFX {
  constructor(props) {
    this.props = props;
    this.start();
  }

  play = (key, volume = 1) => {
    console.log('play', key, volume);
  };
}
