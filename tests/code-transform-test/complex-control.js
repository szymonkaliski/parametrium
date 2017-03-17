var i = 0;
var j = 1;

var r = 200;
var g = 0;
var b = 120;

function setup() {
  var points = [];

  for (i; i < 20; i++) {
    points[i] = i * 100;
  }

  while(j < 10) {
    j++;
  }
}

function draw() {
  background(r, g, b);
}
