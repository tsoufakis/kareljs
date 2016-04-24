'use strict'
var path = require('path');
var assert = require('assert');

var levelsFileName = process.argv[2];
levelsFileName = path.join(__dirname, levelsFileName)

var levels = require(levelsFileName);

var ids = {};

for (let i = 0; i < levels.length; i++) {
    let level = levels[i]
    let id = level.id;

    assert(!!id, `Level ${i} "${level.title}" is missing an id`);
    assert(!ids[id], `id ${id} has been used more than once`);

    ids[id] = true;
}

console.log('levels file looks good');
