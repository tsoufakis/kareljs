scriptdir=$(dirname $0)
browserify -t [ babelify --presets [ react ] ] $scriptdir/test_views.js -o $scriptdir/../public/test_bundle.js
