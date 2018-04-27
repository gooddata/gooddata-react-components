#!/usr/bin/env bash

echo $ cd examples
cd examples

# if first argument is empty
if [ ! -z "$1" ]; then
    BACKENDPARAM=--env.backend="$1"
fi

echo $ webpack-dev-server --https $BACKENDPARAM
webpack-dev-server --https $BACKENDPARAM
