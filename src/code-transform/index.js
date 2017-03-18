import get from 'lodash.get';
import isArray from 'lodash.isarray';
import isNumber from 'lodash.isnumber';
import recast from 'recast';
import times from 'lodash.times';
import types from 'ast-types';

import { LITERAL_TYPES } from '../constants';

const COLOR_CALLEES = ['ambientLight', 'background', 'fill', 'stroke'];

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
        let type = LITERAL_TYPES.CONSTANT;
        const calleeName = get(node, ['parentPath', 'parentPath', 'value', 'callee', 'name']);

        // simple "for (var i = 0..."
        let isInsideFor = isInsideStatement(5, Types.ForStatement.check, node);

        // simple "while (var i < 10"
        let isInsideWhile = isInsideStatement(3, Types.WhileStatement.check, node);

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
                if (body.expression.arguments.some(({ name }) => name === varName)) {
                  isColor = true;
                }
              }
            }
          });
        }

        // assign type to number
        if (isInsideFor || isInsideWhile) {
          type = LITERAL_TYPES.CONTROL;
        } else if (isColor) {
          type = LITERAL_TYPES.COLOR;
        } else {
          type = LITERAL_TYPES.CONSTANT;
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
