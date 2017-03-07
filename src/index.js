import React from 'react';
import ReactDOM from 'react-dom';
import times from 'lodash.times';

import Renderer from './components/renderer';

import codeTransform from './code-transform';

const CODE_MOCK_TESTS = `
// var j = 0;
// for (j; j < 10; j++) { console.log({ j }); }

// var i;
// for (i = 0; i < 10; i++) { console.log({ i }); }

// for (var k = 0; k < 10; k++) { console.log({ k }); }

  var points = [1, 2, 3];

  for (var i = 0; i < points.length; i++) {
    console.log(i);
    var p = points[i];
  }
`;

const CODE_MOCK_LORENZ = `
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
  ambientLight(255);
  fill(255);

  rotateY(2);
  rotateX(2);
  rotateZ(2);

  beginShape();

  for (var i = 0; i < points.length; i++) {
    var p = points[i];
    vertex(p.x, p.y, p.z);
  }

  endShape();
}
`;

const CODE_P1 = `
var np = 300;
var startcol;

function setup() {
  createCanvas(1366, 600);
  background(255);
  noFill();
  noiseSeed(random(100));
  startcol = random(255);
}

function draw() {
  // background(51);
  beginShape();
  var sx, sy;
  for(var i = 0; i < np; i++) {
    var angle = map(i, 0, np, 0, TWO_PI);
    var cx = frameCount * 2 - 200;
    var cy = height / 2 + 50 * sin(frameCount / 50);
    var xx = 100 * cos(angle + cx / 10);
    var yy = 100 * sin(angle + cx / 10);
    var v = createVector(xx, yy);
    xx = (xx + cx) / 150; yy = (yy + cy) / 150;
    v.mult(1 + 1.5 * noise(xx, yy));
    vertex(cx + v.x, cy + v.y);
    if(i == 0) {
      sx = cx + v.x;
      sy = cy + v.y;
    }
  }
  colorMode(HSB);
  var hue = cx / 10 - startcol;
  if(hue < 0) hue += 255;
  stroke(hue, 100, 120);
  strokeWeight(0.1);
  vertex(sx, sy);
  endShape();
  if(frameCount > width + 500) {
    noLoop();
  }
}`

const CODE_MOCK = CODE_P1;

const reapply = (fn, n, val) => {
  return times(n).reduce(acc => fn(acc), val);
};

const App = () => {
  return <div>
    {
      times(9).map(i => {
        const code = reapply(codeTransform, 1, CODE_MOCK);
        // console.log(i, code);

        return <Renderer key={i} code={code}/>
      })
    }
  </div>;
};

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
