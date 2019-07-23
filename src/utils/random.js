export const randomizePerSecond = (cb, delta, frequency = 5000) => {
  if (shouldPerSecond(delta, frequency)) {
    cb();
  }
};

export const shouldPerSecond = (delta, frequency = 5000) => Boolean(Math.random() < delta / frequency);
