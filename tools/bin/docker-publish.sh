#!/bin/bash

docker container prune -f
docker-compose stop
docker-compose build --parallel
#docker-compose build web
#docker-compose build static
docker push 437884575683.dkr.ecr.us-west-2.amazonaws.com/pacifica-website-private:pacifica-frontend-0-1
docker push 437884575683.dkr.ecr.us-west-2.amazonaws.com/pacifica-website-private:pacifica-web-0-1