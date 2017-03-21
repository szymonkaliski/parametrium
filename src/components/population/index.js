import React, { Component } from 'react';
import autobind from 'react-autobind';
import times from 'lodash.times';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { replaceNumbers } from '../../code-transform';
import { evolveGenotype } from '../../actions';

import Renderer from '../renderer';

import './index.css';

class Population extends Component {
  constructor() {
    super();

    autobind(this);

    this.state = {
      pageIdx: 0,
      width: 0
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    this.setState({
      width: this.refWrapper.clientWidth
    });
  }

  onRef(ref) {
    this.refWrapper = ref;
    this.onResize();
  }

  render() {
    const { width } = this.state;
    const { inputCode, population, evolveGenotype } = this.props;

    const marginWidth = 8;
    const paddingWidth = 8;
    const borderWidth = 1;
    const rendererWidth = Math.floor(width / 3 - 2 * (marginWidth + paddingWidth + borderWidth));
    const rendererHeight = rendererWidth;

    return (
      <div ref={this.onRef} className='population'>
        {times(9).map(i => {
          const genotype = population.get(i);
          const numbers = genotype.get('code').toJS();
          const code = replaceNumbers(inputCode, numbers);
          const id = genotype.get('id');

          return (
            <div key={id} className='population__pheontype'>
              <Renderer code={code} width={rendererWidth} height={rendererHeight} />
              <div className='population__evolve-btn' onClick={() => evolveGenotype(id)}>evolve</div>
            </div>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  inputCode: state.get('inputCode'),
  population: state.get('population')
});

const mapDispatchToProps = dispatch => bindActionCreators({ evolveGenotype }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Population);
