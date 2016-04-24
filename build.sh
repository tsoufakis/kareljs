#! /bin/bash

set -eux

scriptdir=$(dirname $0)
browserify=$scriptdir/node_modules/browserify/bin/cmd.js

node $scriptdir/validate_levels.js $scriptdir/public/levels.json
$browserify -t [ babelify --presets [ react ] ] $scriptdir/src/app.js -o $scriptdir/public/appbundle.js
