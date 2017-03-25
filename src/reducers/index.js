import { fromJS } from 'immutable';

import { createPopulation } from '../genetic/population';
import { findNumbers } from '../code-transform';

import { POPULATION_SIZE } from '../constants';

const isDebug = window.location.search.indexOf('debug') >= 0;

let parsed;

if (isDebug) {
  try {
    parsed = JSON.parse(localStorage.getItem('state'));
  } catch (e) {
    console.error(e);
  }

  window.clearState = () => {
    localStorage.setItem('state', null);
    window.location.reload();
  };
}

const emptyState = {
  isEvolving: false,
  inputCode: undefined,
  inputNumbers: [],
  population: [],
  history: [],
  showCode: false
};

const initialState = fromJS(parsed || emptyState);

export default (state = initialState, action) => {
  if (action.type === 'ADD_INPUT_CODE') {
    const numbers = fromJS(findNumbers(action.code));

    state = state
      .set('inputCode', action.code)
      .set('inputNumbers', numbers)
      .set('population', createPopulation(POPULATION_SIZE, numbers));
  }

  if (action.type === 'EVOLVE_GENOTYPE_START') {
    state = state.set('isEvolving', true);
  }

  if (action.type === 'EVOLVE_GENOTYPE_DONE') {
    state = state.set('population', action.population).set('history', action.history).set('isEvolving', false);
  }

  if (action.type === 'SHOW_CODE') {
    state = state.set('showCode', action.code);
  }

  if (action.type === 'HIDE_CODE') {
    state = state.set('showCode', false);
  }

  if (action.type === 'RESET_APP') {
    state = fromJS(emptyState);
  }

  if (isDebug) {
    localStorage.setItem('state', JSON.stringify(state.toJS()));
  }

  return state;
};
