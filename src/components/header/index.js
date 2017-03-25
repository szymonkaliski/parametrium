import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { resetApp, showInfo } from '../../actions';

import './index.css';

const Header = ({ resetApp, showInfo }) => (
  <div className="header">
    <div className="header__content">
      <span className="header__btn header__btn-reset" onClick={resetApp}>reset</span>
      <span className="header__logo">Parametrium</span> — interactive parameter space explorer for P5.js
      <span className="header__btn header__btn-info" onClick={showInfo}>info</span>
    </div>
  </div>
);

const mapDispatchToProps = dispatch => bindActionCreators({ resetApp, showInfo }, dispatch);

export default connect(null, mapDispatchToProps)(Header);
