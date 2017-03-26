var lines = [];
var gaps = [];
var amounts;

var colourSchemes = [[0, 60], [61, 160], [161, 250], [251, 360]];

var schemeNumber;
var currentCol;

function setup() {
  createCanvas(400, 400);
  background(0);
  colorMode(HSB);
  setupLines();
}

var setupLines = function() {
  // select the amount of noise waves to have
  amounts = int(random(3, 6));
  for (var i = 0; i < amounts; i++) {
    lines[i] = [];
    gaps[i] = [];
  }

  for (var a = 0; a < amounts; a++) {
    noiseStart = random(3000);
    noiseInc = random(0.001, 0.01);
    noiseOff = 0.0;

    total = 0;
    // make the original noise wave
    for (var i = 0; i < width; i++) {
      lines[a][i] = map(noise(noiseStart + noiseOff), 0, 1, 0, height);
      noiseOff += noiseInc;
      total += lines[a][i];
    }

    var avg = total / lines[a].length;
    var maximum = max(lines[a]) - avg;
    var minimum = min(lines[a]) - avg;
    // change the density of the waves depending on how high/low the point is
    for (var i = 0; i < width; i++) {
      gaps[a][i] = map(lines[a][i] - avg, minimum, maximum, 10, 25);
    }
  }

  // select a random range of hues
  schemeNumber = int(random(colourSchemes.length));
  currentCol = random(colourSchemes[schemeNumber][0], colourSchemes[schemeNumber][1]);
};

var pos = 0;
var current = 0;

function draw() {
  // change strokeweight based on wave density
  strokeWeight(map(gaps[current][pos], 10, 25, 0.3, 3));

  // loop through the height of the screen
  for (var y = 0; y < height; y += gaps[current][pos]) {
    stroke(currentCol + y / 9, 255, 255);
    line(
      pos - 1,
      lines[current][pos - 1] + y + gaps[current][pos - 1],
      pos,
      lines[current][pos] + y + gaps[current][pos]
    );
  }
  // if the x position hasn't reached the end
  if (pos < width) {
    pos += 1;
  } else {
    // go onto the next wave
    if (current < amounts - 1) {
      current += 1;
      pos = 0;
      currentCol = random(colourSchemes[schemeNumber][0], colourSchemes[schemeNumber][1]);
    }
  }
}

function mousePressed() {
  // reset the screen
  background(0);
  pos = 0;
  current = 0;
  setupLines();
}
