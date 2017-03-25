import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { hideInfo } from '../../actions';

import './index.css';

const Info = ({ hideInfo }) => (
  <div className="info">
    <div onClick={hideInfo} className="info__close-btn">close</div>

    <p className="info__p">
      <span className="info__logo">Parametrium</span> is interactive paramater space explorer for P5.js.
    </p>

    <p className="info__p">
      Upload any working P5 sketch to explore how changing different parameters can push your code in unpredicted directions. If your code works in a browser, it should work here as well.
    </p>

    <p className="info__p">
      Exploration is driven by evolutionary process. Click "evolve" on preview you like, to grow new population based on it.
    </p>

    <p className="info__p">
      Made by <a className="info__link" href="http://szymonkaliski.com">Szymon Kaliski</a>.
    </p>
  </div>
);

const mapDispatchToProps = dispatch => bindActionCreators({ hideInfo }, dispatch);

export default connect(null, mapDispatchToProps)(Info);
