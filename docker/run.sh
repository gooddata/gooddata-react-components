#!/usr/bin/env bash

set -x
ls -la
pwd
#whoami
#id
echo "//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" > .npmrc
cat .npmrc
ssh-agent
ssh-add -l
ssh -T git@github.com

echo $HOME
#echo "//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" >> /code/.npmrc \
yarn install --pure-lockfile
