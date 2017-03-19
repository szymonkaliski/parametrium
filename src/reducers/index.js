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

const initialState = fromJS(
  parsed || {
    inputCode: undefined,
    inputNumbers: []
  }
);

export default (state = initialState, action) => {
  if (action.type === 'ADD_INPUT_CODE') {
    const numbers = findNumbers(action.code);

    state = state
      .set('inputCode', action.code)
      .set('inputNumbers', numbers)
      .set('population', createPopulation(POPULATION_SIZE, numbers));
  }

  if (isDebug) {
    localStorage.setItem('state', JSON.stringify(state.toJS()));
  }

  return state;
};
