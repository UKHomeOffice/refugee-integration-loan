#!/bin/bash

docker --version && docker build -t test-repo-image . && snyk container test test-repo-image
