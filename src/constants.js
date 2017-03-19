export const POPULATION_SIZE = 9;
export const MUTATION_CHANCE = 0.01;

export const SPREADS = {
  CONSTANT: 0.5,
  COLOR: 0.5,
  CONTROL: 0.5
};

export const LITERAL_TYPES = [
  'CONSTANT', // just some value
  'COLOR', // from COLOR_CALLESS
  'CONTROL' // for & while
].reduce((acc, key) => ({ ...acc, [key]: key }), {});
