#!/bin/bash


docker-compose build
docker-compose up -d db
docker-compose up web