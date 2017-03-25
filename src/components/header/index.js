import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { resetApp } from '../../actions';

import './index.css';

const Header = ({ resetApp }) => (
  <div className="header">
    <div className="header__content">
      <span className="header__btn header__btn-reset" onClick={resetApp}>reset</span>
      <span className="header__logo">Parametrium</span> — interactive parameter space explorer for P5.js
      <span className="header__btn header__btn-info">info</span>
    </div>
  </div>
);

const mapDispatchToProps = dispatch => bindActionCreators({ resetApp }, dispatch);

export default connect(null, mapDispatchToProps)(Header);
