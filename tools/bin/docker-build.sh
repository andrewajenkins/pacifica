#!/bin/bash

docker-compose stop
docker container prune -f
docker-compose build db
docker-compose build web
#docker-compose build static
docker-compose up -d db
#docker-compose up -d static
docker-compose up web