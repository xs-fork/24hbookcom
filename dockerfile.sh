#!/usr/bin/env bash

docker build --build-arg BUILDPLATFORM=linux/amd64 -t kubile/24h-book:1.3.0 .