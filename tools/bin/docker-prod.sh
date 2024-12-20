#!/bin/bash

docker-compose stop
docker container prune -f
docker-compose -f ./tools/docker/compose/production.yml up -d db
docker-compose -f ./tools/docker/compose/production.yml up -d static
docker-compose -f ./tools/docker/compose/production.yml up web