import times from 'lodash.times';
import { createGenotype, crossover, mutate } from './genotype';
import { fromJS, List } from 'immutable';

import { random } from '../utils';

const prop = key => obj => obj.get(key);

const dist = (xs, ys) => {
  return Math.sqrt(xs.map((x, i) => Math.pow(x - ys.get(i), 2)).reduce((acc, diff) => acc + diff, 0));
};

const calculateFitness = (genotype, bestFits) => {
  return bestFits
    .map(bestFit => dist(bestFit.get('code').map(prop('value')), genotype.get('code').prop('value')))
    .reduce((acc, dist) => acc + dist, 0) / bestFits.count();
};

const rouletteIdx = (normalizedFitnesses, sumFitnesses) => {
  const value = random() * sumFitnesses;

  return normalizedFitnesses.reduce(
    (acc, fitness, idx) => {
      if (!acc.idx) {
        const newValue = acc.value - fitness;

        return {
          value: newValue,
          idx: newValue <= 0 ? idx : acc.idx
        };
      } else {
        return acc;
      }
    },
    { value, idx: undefined }
  ).idx;
};

export const createPopulation = populationSize => {
  return fromJS(times(populationSize).map(() => createGenotype()));
};

export const evolvePopulation = (inPopulation, history) => {
  let newPopulation = List();

  // add fitnesses to population (the smaller the better)
  const population = inPopulation.map(genotype => {
    return genotype.set('fitness', calculateFitness(genotype, history));
  });

  // normalize and sum fitnesses
  const maxFitnesses = Math.max(...population.map(prop('fitness')));
  const normalizedFitnesses = population.map(genotype => 1 - genotype.get('fitness') / maxFitnesses);
  const sumFitnesses = normalizedFitnesses.reduce((acc, fitness) => acc + fitness, 0);

  // roulette for new population
  while (newPopulation.count() < population.count()) {
    const parentAIdx = rouletteIdx(normalizedFitnesses, sumFitnesses);
    const parentBIdx = rouletteIdx(normalizedFitnesses, sumFitnesses);

    const parentA = population.get(parentAIdx);
    const parentB = population.get(parentBIdx);

    if (parentAIdx !== parentBIdx) {
      const child = mutate(crossover(parentA, parentB));

      newPopulation = newPopulation.push(child);
    } else {
      // in rare chance both random idxs are the same
      // just let the parent live for next iteration
      newPopulation = newPopulation.push(parentA);
    }
  }

  // new population sorted by fitness (again, smaller is better)
  return newPopulation
    .map(genotype => genotype.set('fitness', calculateFitness(genotype, history)))
    .sort((a, b) => a.get('fitness') - b.get('fitness'));
};

export const getGenotype = (population, id) => {
  return population.find(genotype => genotype.get('id') === id);
};
