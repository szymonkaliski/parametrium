import React from 'react';

const LIB_URL = "//cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.7/p5.js";

const Renderer = ({ code }) => {
  return <iframe
    width={360}
    height={360}
    srcDoc={`
      <style>
      * { margin: 0; padding: 0; }
      </style>

      <script type="text/javascript" src="${LIB_URL}"></script>

      <script type="text/javascript">
        ${code}
      </script>
    `}
    style={{
      border:  '1px solid #eee',
      padding: 4,
      margin:  10
    }}/>;
}

export default Renderer;
