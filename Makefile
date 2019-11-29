all: install build

install:
	npm install

build:
	npx webpack-cli --entry ./src/index.js --output public/appbundle.js

start:
	npm start

docker:
	docker image build -t test1 .

run-docker:
	docker container run -p 8000:3000 -p 27017:27017 test1

test:
	node tests/validate_levels.js ../public/levels.json
	node tests/test_models.js
	npm test

clean:
	rm -rf node_modules
