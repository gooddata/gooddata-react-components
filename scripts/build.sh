#!/usr/bin/env bash

build-css: node-sass --importer node_modules/node-sass-magic-importer/dist/cli.js -o styles/css styles/scss/main.scss




rm -rf dist && tsc && cp -rf src/translations/ dist/translations/ && yarn build-css

rm -rf dist && tsc -p tsconfig.dev.json && cp -rf src/translations/ dist/translations/ && yarn build-css

watch:

rm -rf dist && tsc --watch -p tsconfig.dev.json && cp -rf src/translations/ dist/translations/