#! /usr/bin/env bash

docker-compose build
docker-compose run karel-api npm test
