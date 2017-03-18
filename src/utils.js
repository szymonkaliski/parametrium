import randomSeed from 'random-seed';

const seed = randomSeed.create();

export const isInt = n => n % 1 === 0;

export const orderOfMagnitude = n => {
  const eps = 0.000000001;
  const order = Math.abs(n) < eps ? 0 : Math.floor(Math.log(n) / Math.LN10 + eps);

  return Math.pow(10, order);
};

export const random = (...args) => {
  if (args.length === 0) {
    return seed.random();
  } else if (args.length === 1) {
    return seed.random() * args[0];
  } else {
    return seed.random() * Math.abs(args[0] - args[1]) + seed.min(args[0], args[1]);
  }
};

export const chance = percent => random() < percent;

export const clamp = (v, min, max) => Math.max(min, Math.min(v, max));
