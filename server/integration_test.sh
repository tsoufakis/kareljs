#! /usr/bin/env bash

docker-compose build
docker-compose run --entrypoint "npm" karel-api test
