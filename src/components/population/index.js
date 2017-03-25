import React, { Component } from 'react';
import autobind from 'react-autobind';
import times from 'lodash.times';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { replaceNumbers } from '../../code-transform';
import { evolveGenotype, showCode } from '../../actions';
import { clamp } from '../../utils';

import { DISPLAY_PER_PAGE, POPULATION_SIZE } from '../../constants';

import Renderer from '../renderer';

import './index.css';

class Population extends Component {
  constructor() {
    super();

    autobind(this);

    this.state = {
      pageIdx: 0,
      width: 0,
      height: 0
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  moveOffset(dir) {
    this.setState({
      pageIdx: clamp(this.state.pageIdx + dir, 0, POPULATION_SIZE / DISPLAY_PER_PAGE)
    });
  }

  onResize() {
    if (this.refWrapper) {
      this.setState({
        width: this.refWrapper.clientWidth
      });
    }
  }

  onRef(ref) {
    this.refWrapper = ref;
    this.onResize();
  }

  render() {
    const { width, pageIdx } = this.state;
    const { inputCode, population, evolveGenotype, showCode } = this.props;

    const marginWidth = 8;
    const paddingWidth = 8;
    const borderWidth = 1;

    const rendererWidth = Math.floor(width / 3 - 2 * (marginWidth + paddingWidth + borderWidth));
    const rendererHeight = rendererWidth;

    return (
      <div className="population">
        <div ref={this.onRef} className="population__content">
          {times(DISPLAY_PER_PAGE).map(i => {
            const genotype = population.get(pageIdx * DISPLAY_PER_PAGE + i);
            const numbers = genotype.get('code').toJS();
            const code = replaceNumbers(inputCode, numbers);
            const id = genotype.get('id');

            return (
              <div key={id} className="population__pheontype">
                <Renderer code={code} width={rendererWidth} height={rendererHeight} />
                <div className="population__phenotype-btns">
                  <div className="population__phenotype-btn" onClick={() => evolveGenotype(id)}>evolve</div>
                  <div className="population__phenotype-btn" onClick={() => showCode(code)}>code</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="population__nav">
          <div onClick={() => this.moveOffset(-1)} className="population__nav-btn">{'<<<'}</div>
          <div className="population__nav-text">{pageIdx + 1} / {POPULATION_SIZE / DISPLAY_PER_PAGE}</div>
          <div onClick={() => this.moveOffset(+1)} className="population__nav-btn">{'>>>'}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  inputCode: state.get('inputCode'),
  population: state.get('population')
});

const mapDispatchToProps = dispatch => bindActionCreators({ evolveGenotype, showCode }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Population);
