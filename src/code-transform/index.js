const get    = require('lodash.get');
const recast = require('recast');
const times  = require('lodash.times');

const COLOR_CALLEES = [
  'ambientLight',
  'background',
  'fill',
  'stroke',
];

const orderOfMagnitude = (n) => {
  const eps   = 0.000000001;
  const order = Math.abs(n) < eps ? 0 : Math.floor(Math.log(n) / Math.LN10 + eps);

  return Math.pow(10, order);
};

const isInt = (n) => n % 1 === 0;

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

const Types = recast.types.namedTypes;

export default (code) => {
  const ast = recast.parse(code);

  recast.visit(ast, {
    visitLiteral: function(node) {
      // console.log(node);
      const calleeName = get(node, [ 'parentPath', 'parentPath', 'value', 'callee', 'name' ]);

      // 5 steps max: "for ( var i = 0..."
      const insideForStatement = times(5).reduce(({ node, found }, i) => ({
        found: Types.ForStatement.check(node.value) || found,
        node:  node.parentPath || node,
      }), { node, found: false }).found;

      let newValue;
      const orgValue = node.value.value;

      if (COLOR_CALLEES.indexOf(calleeName) >= 0) {
        // for colors - be smart about values
        newValue = Math.round(random(255));

        // TODO: figure out if this works for "fill(0, 200, 100)"
      }
      else {
        // for generic values - try changing within order of magnitude of original value
        const magnitude = orderOfMagnitude(orgValue);
        newValue        = orgValue + random(-magnitude / 2, magnitude / 2);
      }

      if (insideForStatement && isInt(orgValue)) {
        newValue = Math.round(newValue);
      }

      node.value.value = newValue;
      node.value.raw   = `${newValue}`;

      this.traverse(node);
    },
  });

  return recast.print(ast).code;
}
