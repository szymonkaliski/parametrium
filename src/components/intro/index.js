import Dropzone from 'react-dropzone';
import React, { Component } from 'react';
import autobind from 'react-autobind';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { addInputCode } from '../../actions';

import './index.css';

class Intro extends Component {
  constructor() {
    super();
    autobind(this);
  }

  onDrop(files) {
    const file = files[0];

    const reader = new FileReader();

    reader.onload = e => this.props.addInputCode(e.target.result);
    reader.readAsText(file);
  }

  render() {
    return (
      <div className="intro">

        <div className="intro__text">
          Welcome to <span className="intro__logo">Parametrium</span> — interactive parameter space explorer for P5.js
        </div>

        <div className="intro__content">
          <Dropzone
            className="dropzone"
            activeClassName="dropzone--active"
            accept="text/javascript"
            onDrop={this.onDrop}
            multiple={false}
          >
            <span className="dropzone__text">
              Drop P5.js sketch here, or click to select.
            </span>
          </Dropzone>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ addInputCode }, dispatch);

export default connect(null, mapDispatchToProps)(Intro);
