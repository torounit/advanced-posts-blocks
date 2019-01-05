#!/usr/bin/env bash

npm install
npm run build
sed -i -e "s/nightly/${TRAVIS_TAG}/" $(basename $TRAVIS_REPO_SLUG).php
sed -i -e "s/nightly/${TRAVIS_TAG}/" readme.txt
sed -i -e "s/nightly/${TRAVIS_TAG}/" package.json
