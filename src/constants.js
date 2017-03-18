export const MUTATION_CHANCE = 0.01;

export const SPREADS = {
  CONSTANT: 0.1,
  COLOR: 0.05,
  CONTROL: 0.1
};

export const LITERAL_TYPES = [
  'CONSTANT', // just some value
  'COLOR', // from COLOR_CALLESS
  'CONTROL' // for & while
].reduce((acc, key) => ({ ...acc, [key]: key }), {});
