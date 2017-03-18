import { fromJS } from 'immutable';
import { fromJSON, toJSON } from 'transit-immutable-js';

import { evolvePopulation, getGenotype } from './population';

import { HISTORY_SIZE } from '../constants';

const { min } = Math;

self.onmessage = event => {
  const data = fromJSON(event.data);
  const population = data.get('population');
  const history = data.get('history');

  const updatedHistory = history
    .unshift(getGenotype(population, data.get('evolveId')))
    .setSize(min(HISTORY_SIZE, history.count() + 1));

  const evolvedPopulation = evolvePopulation(population, updatedHistory);

  self.postMessage(
    toJSON(
      fromJS({
        history: updatedHistory,
        population: evolvedPopulation
      })
    )
  );
};
