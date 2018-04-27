#!/usr/bin/env bash

build(){
    rm -rf dist
    tsc
    cp -rf src/translations/ dist/translations/
    node-sass --importer node_modules/node-sass-magic-importer/dist/cli.js -o styles/css styles/scss/main.scss
}

build-dev(){
    rm -rf dist
    tsc -p tsconfig.dev.json
    cp -rf src/translations/ dist/translations/
    node-sass --importer node_modules/node-sass-magic-importer/dist/cli.js -o styles/css styles/scss/main.scss
}

build-dev-watch(){
    rm -rf dist
    cp -rf src/translations/ dist/translations/
    node-sass --importer node_modules/node-sass-magic-importer/dist/cli.js -o styles/css styles/scss/main.scss

    tsc --watch -p tsconfig.dev.json
}


FLAG=$1

if [ "$FLAG" = "--dev" ]; then
    build-dev
elif [ "$FLAG" = "--dev-watch" ]; then
    build-dev-watch
else
    build
fi
