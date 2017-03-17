const get = require('lodash.get');
const isArray = require('lodash.isarray');
const isNumber = require('lodash.isnumber');
const recast = require('recast');
const times = require('lodash.times');
const types = require('ast-types');

const COLOR_CALLEES = ['ambientLight', 'background', 'fill', 'stroke'];

const LITERALS = [
  'CONSTANT', // just some value
  'COLOR', // from COLOR_CALLESS
  'CONTROL' // for & while
].reduce((acc, key) => ({ ...acc, [key]: key }), {});

// const isInt = n => n % 1 === 0;

// const orderOfMagnitude = n => {
//   const eps = 0.000000001;
//   const order = Math.abs(n) < eps
//     ? 0
//     : Math.floor(Math.log(n) / Math.LN10 + eps);

//   return Math.pow(10, order);
// };

// const random = (...args) => {
//   if (args.length === 0) {
//     return Math.random();
//   } else if (args.length === 1) {
//     return Math.random() * args[0];
//   } else {
//     return Math.random() * Math.abs(args[0] - args[1]) +
//       Math.min(args[0], args[1]);
//   }
// };

const Types = recast.types.namedTypes;

const safeAST = code => {
  let ast;

  try {
    ast = recast.parse(code);
  } catch (e) {
    return { error: e, ast };
  }

  return { ast };
};

const isInsideStatement = (maxDepth, typeCheck, node) => {
  return times(maxDepth).reduce(
    ({ node, found }, i) => ({
      found: found || typeCheck(node.value),
      node: node.parentPath || node
    }),
    { node, found: false }
  ).found;
};

const traverseBody = (node, cb) => {
  if (isArray(node.body)) {
    node.body.forEach(node => {
      cb(node);
      traverseBody(node, cb);
    });
  } else if (node.body) {
    cb(node.body);
    traverseBody(node.body, cb);
  }
};

export const findNumbers = code => {
  const numbers = [];

  const { ast } = safeAST(code);

  if (ast.error) {
    return;
  }

  types.visit(ast, {
    visitLiteral: function(node) {
      if (isNumber(node.value.value)) {
        let type = LITERALS.CONSTANT;
        const calleeName = get(node, [
          'parentPath',
          'parentPath',
          'value',
          'callee',
          'name'
        ]);

        // simple "for (var i = 0..."
        let isInsideFor = isInsideStatement(5, Types.ForStatement.check, node);

        // simple "while (var i < 10"
        let isInsideWhile = isInsideStatement(
          3,
          Types.WhileStatement.check,
          node
        );

        // more complex situtation:
        // var i = 0;
        // ...
        // for (i; ...
        if (Types.VariableDeclarator.check(node.parentPath.value)) {
          const varName = node.parentPath.value.id.name;
          const scope = node.scope.lookup(varName);

          traverseBody(scope.node, body => {
            if (Types.ForStatement.check(body)) {
              if (body.init.name === varName) {
                isInsideFor = true;
              }
            } else if (Types.WhileStatement.check(body)) {
              if (body.test.left.name === varName) {
                isInsideWhile = true;
              }
            }
          });
        }

        // simple callee(number)
        let isColor = COLOR_CALLEES.indexOf(calleeName) >= 0;

        // more complex situation:
        // var c = 255
        // ...
        // background(c);
        if (Types.VariableDeclarator.check(node.parentPath.value)) {
          const varName = node.parentPath.value.id.name;
          const scope = node.scope.lookup(varName);

          traverseBody(scope.node, body => {
            if (Types.ExpressionStatement.check(body)) {
              if (body.expression.callee) {
                if (
                  body.expression.arguments.some(({ name }) => name === varName)
                ) {
                  isColor = true;
                }
              }
            }
          });
        }

        // assign type to number
        if (isInsideFor || isInsideWhile) {
          type = LITERALS.CONTROL;
        } else if (isColor) {
          type = LITERALS.COLOR;
        } else {
          type = LITERALS.CONSTANT;
        }

        numbers.push({
          type,
          value: node.value.value
        });
      }

      this.traverse(node);
    }
  });

  return numbers;
};

export const replaceNumbers = (code, numbers) => {
  const { ast } = safeAST(code);

  if (ast.error) {
    return;
  }

  let idx = 0;

  types.visit(ast, {
    visitLiteral: function(node) {
      const { value: number } = numbers[idx];
      idx++;

      node.value.value = number;
      node.value.raw = `${number}`;
    }
  });

  return recast.print(ast).code;
};
