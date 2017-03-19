import React from 'react';
import times from 'lodash.times';
import { connect } from 'react-redux';

import { replaceNumbers } from '../../code-transform';

import Renderer from '../renderer';

const Population = ({ inputCode, population }) => {
  return (
    <div>
      {times(9).map(i => {
        const numbers = population.getIn([i, 'code']).toJS();
        const code = replaceNumbers(inputCode, numbers);

        return <Renderer key={i} code={code} />;
      })}
    </div>
  );
};

const mapStateToProps = state => ({
  inputCode: state.get('inputCode'),
  population: state.get('population')
});

export default connect(mapStateToProps)(Population);
