const fs     = require('fs');
const get    = require('lodash.get');
const recast = require('recast');

const orderOfMagnitude = (n) => {
  const eps   = 0.000000001;
  const order = Math.abs(n) < eps ? 0 : Math.floor(Math.log(n) / Math.LN10 + eps);

  return Math.pow(10, order);
};

const random = (...args) => {
  if (args.length === 0) {
    return Math.random();
  }
  else if (args.length === 1) {
    return Math.random() * args[0];
  }
  else {
    return Math.random() * Math.abs(args[0] - args[1]) + Math.min(args[0], args[1]);
  }
};

const code = fs.readFileSync(process.argv[2], { encoding: 'utf8' });
const ast  = recast.parse(code);

const colorCallees = [
  'ambientLight',
  'background',
  'fill',
  'stroke',
];

recast.visit(ast, {
  visitLiteral: function(node) {
    const calleeName = get(node, [ 'parentPath', 'parentPath', 'value', 'callee', 'name' ]);

    let newValue;

    if (colorCallees.indexOf(calleeName) >= 0) {
      newValue = Math.round(random(255)); // TODO: figure out [ r, g, b, a ]
    }
    else {
      // for generic values - try changing within order of magnitude of original value
      const orgValue  = node.value.value;
      const magnitude = orderOfMagnitude(orgValue);
      newValue  = orgValue + random(-magnitude / 2, magnitude / 2);
    }

    node.value.value = newValue;
    node.value.raw   = `${newValue}`;

    this.traverse(node);
  },
});


console.log(recast.print(ast).code);
