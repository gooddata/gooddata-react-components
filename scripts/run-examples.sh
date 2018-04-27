#!/usr/bin/env bash

echo $ cd examples
cd examples

RESTPARAMS=$@

# if first argument is empty
if [ ! -z "$1" ]; then
    BACKENDPARAM=--env.backend="$1"
    RESTPARAMS=${@:2}
fi

echo $ webpack-dev-server --https $BACKENDPARAM $RESTPARAMS
webpack-dev-server --https $BACKENDPARAM $RESTPARAMS
