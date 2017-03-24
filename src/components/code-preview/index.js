import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { hideCode } from '../../actions';

import './index.css';

const CodePreview = ({ code, hideCode }) => (
  <div className="code-preview">
    <div onClick={hideCode} className="code-preview__close-btn">close</div>
    <pre>{code}</pre>
  </div>
);

const mapDispatchToProps = dispatch => bindActionCreators({ hideCode }, dispatch);

export default connect(null, mapDispatchToProps)(CodePreview);
