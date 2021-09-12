#!/bin/bash

set -ex

# publish
docker container prune -f
docker-compose stop
docker-compose build --parallel
aws ecr get-login-password | docker login --username AWS --password-stdin 437884575683.dkr.ecr.us-west-2.amazonaws.com/pacifica-website-private
docker push 437884575683.dkr.ecr.us-west-2.amazonaws.com/pacifica-website-private:pacifica-frontend-0-1
docker push 437884575683.dkr.ecr.us-west-2.amazonaws.com/pacifica-website-private:pacifica-web-0-1

# push production.yml
scp -i ../pacifica-website.cer -r $(pwd)/tools/docker/compose/production.yml ec2-user@52.35.184.192:/home/ec2-user/

# ssh pull and up
ssh -i ../pacifica-website.cer ec2-user@52.35.184.192 \
  'aws ecr get-login-password | docker login --username AWS --password-stdin 437884575683.dkr.ecr.us-west-2.amazonaws.com/pacifica-website-private;
  docker image prune --all --force;
  docker pull 437884575683.dkr.ecr.us-west-2.amazonaws.com/pacifica-website-private:pacifica-frontend-0-1;
  docker pull 437884575683.dkr.ecr.us-west-2.amazonaws.com/pacifica-website-private:pacifica-web-0-1;
  docker-compose -f production.yml up --detach'