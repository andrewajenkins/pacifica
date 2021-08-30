#!/bin/bash

docker container prune -f
docker-compose stop
docker-compose build db
docker-compose build web
docker-compose up -d db
#docker-compose up -d static
docker-compose up web