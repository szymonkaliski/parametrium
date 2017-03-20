import React from 'react';
import times from 'lodash.times';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { replaceNumbers } from '../../code-transform';
import { evolveGenotype } from '../../actions';

import Renderer from '../renderer';

const Population = ({ inputCode, population, evolveGenotype }) => {
  return (
    <div>
      {times(9).map(i => {
        const genotype = population.get(i);
        const numbers = genotype.get('code').toJS();
        const code = replaceNumbers(inputCode, numbers);
        const id = genotype.get('id');

        return (
          <div key={id} style={{ display: 'inline-block' }}>
            <Renderer code={code} />
            <div onClick={() => evolveGenotype(id)}>evolve</div>
          </div>
        );
      })}
    </div>
  );
};

const mapStateToProps = state => ({
  inputCode: state.get('inputCode'),
  population: state.get('population')
});

const mapDispatchToProps = dispatch => bindActionCreators({ evolveGenotype }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Population);
