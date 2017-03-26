var cnv;

var NB_FRAMES = 100;

var frame_count = 0;

function activation(t) {
  return ((1 - cos(2 * PI * t)) / 2) ** 1;
}

function object(id) {
  this.id = id;

  this.draw = function() {
    var t = frame_count % NB_FRAMES / NB_FRAMES;

    var x0 = lerp(0, window.innerWidth, this.id / NB);

    theta = PI / 2;

    var xx = x0;
    var yy = 0;

    var Nt = 75;

    var step = window.innerHeight / Nt;

    var turn = lerp(0, 0.4, activation((this.id / NB + 0 * t) % 1));

    stroke(255);
    strokeWeight(1);
    noFill();
    beginShape();

    vertex(xx, yy);

    for (var i = 0; i <= Nt; i++) {
      theta += turn * sin(100 * noise(1000) + 2 * PI * (15 * noise(0.2 * this.id / NB, 0.02 * i) + t));
      //theta += turn*sin(100*noise(1000)+2*PI*(20*noise(0.02*i)+t + 0.1*sin(2*PI*this.id/NB)));
      xx += step * cos(theta);
      yy += step * sin(theta);

      var xx2 = lerp(xx, x0, i / Nt * (i / Nt) * (i / Nt));
      var yy2 = lerp(yy, lerp(0, window.innerHeight - 0, i / Nt), max(i / Nt, 1 - sqrt(i / Nt)));

      vertex(xx2, yy2);
    }
    endShape();
  };
}

var Objects = [];
var NB = 10;

function setup() {
  curSeed = 11;
  noiseSeed(curSeed);
  randomSeed(1);

  cnv = createCanvas(window.innerWidth, window.innerHeight);
  //cnv.parent("canvas");

  background(0);

  for (var i = 0; i < NB; i++) {
    Objects[i] = new object(i);
  }
}

function mousePressed() {
  curSeed = floor(random() * 10000);
  noiseSeed(curSeed);
  console.log(curSeed);
}

function draw() {
  background(0);

  var t = frame_count % NB_FRAMES / NB_FRAMES;

  for (var i = 0; i < NB; i++)
    Objects[i].draw();

  noStroke();
  fill(255);

  frame_count++;
  if (frame_count <= 100 && frame_count > 80) {
    //saveCanvas('s5_'+frame_count+'.png');
  }
}
