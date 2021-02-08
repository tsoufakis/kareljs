#! /bin/bash

docker-compose run -e "MONGODB_URI=mongodb://db:27017/molemarch" --entrypoint "" -- api npm test
docker-compose down