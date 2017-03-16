import { fromJS } from 'immutable';

import codeTransform from '../code-transform';

const isDebug = window.location.search.indexOf('debug') >= 0;

let parsed;

if (isDebug) {
  try {
    parsed = JSON.parse(localStorage.getItem('state'));
  }
  catch (e) {
    console.error(e);
  }

  window.clearState = () => {
    localStorage.setItem('state', null);
    window.location.reload();
  }
}

const initialState = fromJS(parsed || {
  inputCode: undefined
});

export default (state = initialState, action) => {
  if (action.type === 'ADD_INPUT_CODE') {
    state = state.set('inputCode', action.code);
  }

  if (isDebug) {
    localStorage.setItem('state', JSON.stringify(state.toJS()));
  }

  // testing...
  const code = state.get('inputCode');
  if (code) {
    codeTransform(code);
  }

  return state;
};
