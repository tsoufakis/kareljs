#! /bin/sh

set -eux

scriptdir=$(dirname $0)
browserify=$scriptdir/node_modules/browserify/bin/cmd.js

$browserify -t [ babelify --presets [ env @babel/preset-react ] ] $scriptdir/src/index.js -o $scriptdir/public/appbundle.js
