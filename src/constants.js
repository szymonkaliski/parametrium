export const HISTORY_SIZE = 3;
export const DISPLAY_PER_PAGE = 9;

export const MUTATION_CHANCE = 0.01;
export const POPULATION_SIZE = DISPLAY_PER_PAGE * 100;

export const SPREADS = {
  CONSTANT: 0.75,
  COLOR: 0.75,
  CONTROL: 0.75
};

export const LITERAL_TYPES = [
  'CONSTANT', // just some value
  'COLOR', // from COLOR_CALLESS
  'CONTROL' // for & while
].reduce((acc, key) => ({ ...acc, [key]: key }), {});
