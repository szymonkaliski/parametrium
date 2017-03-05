import React from 'react';
import ReactDOM from 'react-dom';
import times from 'lodash.times';

import Renderer from './components/renderer';

import codeTransform from './code-transform';

const CODE_MOCK = `
var x = 2;
var y = 2;
var z = 2;

var sigma = 10;
var rho = 28;
var beta = 8/3;

var points = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);

  for (var i = 0; i < 10000; i++) {
    var dt = 0.01;
    var dx = (sigma * (y - x)) * dt;
    var dy = (x * (rho - z) - y) * dt;
    var dz = (x * y - beta * z) * dt;

    x += dx;
    y += dy;
    z += dz;

    points.push(createVector(x, y, z));
  }
}

function draw() {
  background(0);

  scale(3);
  ambientLight(255, 255, 255);
  rotateY(2);
  rotateX(2);

  beginShape();

  for (var i = 0; i < points.length; i++) {
    var p = points[Math.round(i)];
    if (p) {
      vertex(p.x, p.y, p.z);
    }
  }

  endShape();
}
`;

const reapply = (fn, n, val) => {
  return times(n).reduce(acc => fn(acc), val);
};

const App = () => {
  return <div>
    {
      times(12).map(i => {
        return <Renderer key={i} code={reapply(codeTransform, 2, CODE_MOCK)}/>
      })
    }
  </div>;
};

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
