import Dropzone from 'react-dropzone';
import React, { Component } from 'react';
import autobind from 'react-autobind';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { addInputCode, showInfo } from '../../actions';
import { EXAMPLES } from '../../constants';

import './index.css';

class Intro extends Component {
  constructor() {
    super();
    autobind(this);
  }

  onDrop(files, rejected) {
    if (files.length === 0) {
      return;
    }

    const file = files[0];

    if (file.type.indexOf('javascript') > 0) {
      const reader = new FileReader();

      reader.onload = e => this.props.addInputCode(e.target.result);
      reader.readAsText(file);
    }
  }

  render() {
    return (
      <div className="intro">
        <div className="intro__text">
          welcome to <span className="intro__logo">Parametrium</span> — interactive parameter space explorer for P5.js
          <div className="intro__info-btn" onClick={this.props.showInfo}>
            info
          </div>
        </div>

        <div className="intro__content">
          <Dropzone className="dropzone" activeClassName="dropzone--active" onDrop={this.onDrop} multiple={false}>
            <span className="dropzone__text">drop sketch here, or click to select</span>
          </Dropzone>
        </div>

        <div className="intro__examples">
          <div className="intro__examples-text">or load one of examples:</div>

          <ul className="intro__examples-list">
            {EXAMPLES.map(({ name, url, code }) =>
              <li className="intro__examples-list-item" onClick={() => this.props.addInputCode(code)}>
                {name} (<a className="intro__examples-original-link" href={url}>original</a>)
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ addInputCode, showInfo }, dispatch);

export default connect(null, mapDispatchToProps)(Intro);
