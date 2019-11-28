all: install

install:
	npm install

build:
	./build.sh

test:
	node tests/validate_levels.js ../public/levels.json
	node tests/test_models.js
	npm test

clean:
	rm -rf node_modules
