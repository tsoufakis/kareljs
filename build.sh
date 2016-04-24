#! /bin/bash

set -eux

scriptdir=$(dirname $0)

browserify -t [ babelify --presets [ react ] ] $scriptdir/src/app.js -o $scriptdir/public/appbundle.js
