// const escodegen    = require('escodegen');
// const esprima      = require('esprima');
// const fs           = require('fs');
// const { traverse } = require('esprima-ast-utils');

// const code = fs.readFileSync(process.argv[2], { encoding: 'utf8' });

// const ast = esprima.parse(code);

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

// traverse(ast, (node) => {
//   if (node.type === 'Literal') {
//     const orgValue  = node.value;
//     const magnitude = orderOfMagnitude(orgValue);
//     const newValue  = orgValue + random(-magnitude / 2, magnitude / 2);

//     node.value    = newValue;
//     node.raw      = `${newValue}`;
//     node.orgValue = orgValue;

//     console.log(node);
//   }
// });

// const generated = escodegen.generate(ast);

// console.log(generated);


const fs     = require('fs');
const recast = require('recast');

const code = fs.readFileSync(process.argv[2], { encoding: 'utf8' });

const ast = recast.parse(code);

recast.visit(ast, {
  visitNode: function(path) {
    if (path.value.type === 'Literal') {
      const orgValue  = path.value.value;
      const magnitude = orderOfMagnitude(orgValue);
      const newValue  = orgValue + random(-magnitude / 2, magnitude / 2);

      path.value.value = newValue;
      path.value.raw   = `${newValue}`;
    }

    this.traverse(path);
  }
});


console.log(recast.print(ast).code);
