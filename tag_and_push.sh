#! /usr/bin/env bash

set -eux

HOSTNAME=gcr.io
PROJECT_ID=lunch-picker-1529881352684
TAG=$1

docker build -t karel-api:$TAG ./server
docker build -t karel-web:$TAG ./client

for img in "karel-api" "karel-web"; do
    gcr_repo=$HOSTNAME/$PROJECT_ID/$img
    docker tag $img:$TAG $gcr_repo:$TAG
    docker push $gcr_repo:$TAG
done
