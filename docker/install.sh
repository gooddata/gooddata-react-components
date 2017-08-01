#!/bin/bash
set -x
echo "//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" >> /code/.npmrc

#ssh-agent /.ssh
cd /code
ls -la
whoami
npm whoami

ssh-add -l
ssh -T git@github.com
yarn install --pure-lockfile
