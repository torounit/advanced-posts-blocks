#!/usr/bin/env bash

npm install
npm run build

echo 'Generate readme.'
curl -L https://raw.githubusercontent.com/fumikito/wp-readme/master/wp-readme.php | php
