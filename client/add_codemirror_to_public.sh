#! /bin/bash

scriptdir=$(dirname $0)
cp $scriptdir/node_modules/codemirror/lib/* $scriptdir/public
cp $scriptdir/node_modules/codemirror/mode/javascript/javascript.js $scriptdir/public
