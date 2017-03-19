#!/usr/bin/env bash

if [ -z "$1" ]; then
  echo "Pass directory of js files to test"
  exit 0
fi

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

pushd "$DIR"/.. > /dev/null

NODE_ENV=development ./node_modules/.bin/electron tests/code-transform-electron-tests "$1" | tee code-transform-electron-tests.log | ./node_modules/.bin/garnish

popd
