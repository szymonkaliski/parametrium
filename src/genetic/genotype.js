import uuid from 'uuid';
import { fromJS } from 'immutable';

import { chance, clamp, isInt, orderOfMagnitude, random } from '../utils';

import { MUTATION_CHANCE, LITERAL_TYPES, SPREADS } from '../constants';

// mutations for different literals
const MUTATIONS = {
  [LITERAL_TYPES.CONSTANT]: num => {
    const value = orderOfMagnitude(Math.abs(num));

    return num + random(-value * SPREADS.COLOR, value * SPREADS.COLOR);
  },

  [LITERAL_TYPES.COLOR]: num => {
    return clamp(num + random(-255 * SPREADS.COLOR, 255 * SPREADS.COLOR), 0, 255);
  },

  [LITERAL_TYPES.CONTROL]: num => {
    const value = orderOfMagnitude(num);
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

export const mutate = (genotype, mutationChance = MUTATION_CHANCE) => {
  // MUTATION_CHANCE that given value will be random
  const code = genotype.get('code').map(number => {
    if (!chance(mutationChance)) {
      return number;
    }

    const mutated = MUTATIONS[number.get('type')](number.get('value'));

    if (isNaN(number.get('value')) || isNaN(mutated)) {
      console.warning('NaN in mutation', mutated, number.toJS());
      return number;
    }

    return number.set('value', mutated);
  });

  return createGenotype(code);
};
