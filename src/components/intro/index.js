import Dropzone from 'react-dropzone';
import React, { Component } from 'react';
import autobind from 'react-autobind';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { addInputCode } from '../../actions';

class Intro extends Component {
  constructor() {
    super();
    autobind(this);
  }

  onDrop(files) {
    const file = files[0];

    const reader = new FileReader();

    reader.onload = (e) => this.props.addInputCode(e.target.result);
    reader.readAsText(file);
  }

  render() {
    return <div>
      <Dropzone
        accept='text/javascript'
        onDrop={ this.onDrop }
        multiple={ false }>
        <div>
          Drop P5.js sketch here, or click to select.
        </div>
      </Dropzone>
    </div>;
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addInputCode
}, dispatch);

export default connect(null, mapDispatchToProps)(Intro);
