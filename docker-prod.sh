#!/bin/bash

docker-compose stop
docker container prune -f
docker-compose -f ./production.yml up -d db
docker-compose -f ./production.yml up -d static
docker-compose -f ./production.yml up web