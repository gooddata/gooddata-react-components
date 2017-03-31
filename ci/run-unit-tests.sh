#!/bin/bash -x

DIR=$(dirname $0)

echo "Running unit tests..."

. $DIR/lib.sh

PATH=$PATH:/opt/npm/node_modules/.bin:./node_modules/.bin

mkdir -p $DIR/results

JEST_SUITE_NAME="DataLayer Unit Tests" JEST_JUNIT_OUTPUT="$DIR/results/test-results.xml" jest --config=$DIR/../jest.ci.json
