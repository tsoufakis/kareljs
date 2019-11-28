#! /bin/bash

set -eux

scriptdir=$(dirname $0)
browserify=$scriptdir/node_modules/browserify/bin/cmd.js

$browserify -t [ babelify --presets [ es2015 react ] ] $scriptdir/src/index.js -o $scriptdir/public/appbundle.js
