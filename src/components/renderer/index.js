import React from 'react';

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

const Renderer = ({ code, width, height }) => (
  <iframe className="iframe" width={width} height={height} srcDoc={generateHTML(code)} />
);

export default Renderer;
