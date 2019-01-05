#!/usr/bin/env bash

npm run build:production
sed -i -e "s/nightly/${TRAVIS_TAG}/" $(basename $TRAVIS_REPO_SLUG).php
sed -i -e "s/nightly/${TRAVIS_TAG}/" readme.txt
