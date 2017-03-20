var x = 1;
var y = 0;
var z = 0;

var sigma = 10;
var rho = 28;
var beta = 8 / 3;

var points = [];
var numPoints = 5000;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);

  for (var i = 0; i < numPoints; i++) {
    var dt = 0.01;
    var dx = sigma * (y - x) * dt;
    var dy = (x * (rho - z) - y) * dt;
    var dz = (x * y - beta * z) * dt;
    x += dx;
    y += dy;
    z += dz;
    points.push(createVector(x, y, z));
  }
}

function draw() {
  background(100);

  ambientLight(255);
  fill(120);

  scale(3);
  rotateX(3);
  rotateY(3);
  rotateZ(3);

  beginShape();
  for (var i = 0; i < points.length; i++) {
    vertex(points[i].x, points[i].y, points[i].z);
  }
  endShape();
}
