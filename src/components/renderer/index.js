import React, { Component } from 'react';
import autobind from 'react-autobind';

import './index.css';

const LIB_URL = '//cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.7/p5.js';

const generateHTML = code => {
  return `
    <style>
      * { margin: 0; padding: 0; }
    </style>

    <script type="text/javascript" src="${LIB_URL}"></script>

    <script type="text/javascript">
      ${code}
    </script>`;
};

class Renderer extends Component {
  constructor() {
    super();

    autobind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.width !== this.props.width || prevProps.height !== this.props.height) {
      // reload ref iframe srcdoc to get new window size in the code (if it uses window.innerWidth/Height to set canvas)
      if (prevProps.code === this.props.code) {
        this.refIframe.srcdoc = generateHTML(this.props.code);
      }
    }
  }

  onRef(ref) {
    this.refIframe = ref;
  }

  render() {
    const { width, height, code } = this.props;

    if (!code) {
      return null;
    }

    return <iframe ref={this.onRef} className="iframe" width={width} height={height} srcDoc={generateHTML(code)} />;
  }
}

export default Renderer;
