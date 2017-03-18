import uuid from 'uuid';
import { fromJS } from 'immutable';

import { chance, clamp, isInt, orderOfMagnitude, random } from '../utils';

import { MUTATION_CHANCE, LITERAL_TYPES, SPREADS } from '../constants';

// mutations for different literals
const MUTATIONS = {
  [LITERAL_TYPES.CONSTANT]: num => {
    const order = orderOfMagnitude(num);
    const value = Math.pow(10, order);

    return num + random(-value * SPREADS.COLOR, value * SPREADS.COLOR);
  },

  [LITERAL_TYPES.COLOR]: num => {
    return clamp(num + random(-255 * SPREADS.COLOR, 255 * SPREADS.COLOR), 0, 255);
  },

  [LITERAL_TYPES.CONTROL]: num => {
    const order = orderOfMagnitude(num);
    const value = Math.pow(10, order);
    const newNum = num + random(-value * SPREADS.COLOR, value * SPREADS.COLOR);

    return isInt(num) ? Math.round(newNum) : newNum;
  }
};

export const createGenotype = code => {
  return fromJS({ code, id: uuid.v4() });
};

export const crossover = (parentA, parentB) => {
  // 50/50 chance that given value comes from this genotype or partner
  const code = parentA.get('code').map((v, i) => chance(0.5) ? v : parentB.getIn(['code', i]));

  return createGenotype(code);
};

export const mutate = genotype => {
  // MUTATION_CHANCE that given value will be random
  const code = genotype.get('code').map(number => {
    if (!chance(MUTATION_CHANCE)) {
      return number;
    }

    return number.update('value', value => MUTATIONS[number.get('type')](value));
  });

  return createGenotype(code);
};
