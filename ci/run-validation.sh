#!/bin/bash

DIR=$(dirname $0)

echo "Validating source code..."

. $DIR/lib.sh

echo "Running tslint"

mkdir -p $DIR/results

tslint --config=tslint.json --format=checkstyle --out=$DIR/results/tslint-results.xml index.ts src/**/*.ts
