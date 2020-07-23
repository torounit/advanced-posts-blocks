#!/usr/bin/env bash

set -e
version=$1

sed -i.bak -e "s/^Stable tag: .*/Stable tag:        ${version}/g" README.md;
rm README.md.bak

