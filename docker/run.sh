#!/usr/bin/env bash

set -x
ls -la
pwd
#whoami
#id
echo $HOME
chmod 600 /root/.ssh
chmod 600 /root/.ssh/*
ls -la $HOME


ls -la /root/.ssh
echo "//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" > $HOME/.npmrc
cat ~/.npmrc
echo 'Host github.com
    StrictHostKeyChecking no
' >> /root/.ssh/config
cat /root/.ssh/config
eval "$(ssh-agent)"
#ssh-agent
ssh-add /root/.ssh/id_rsa

ssh-add -l

#ssh -v git@github.com

# yarn cache dir
# #echo "//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" >> /code/.npmrc \
yarn install --pure-lockfile
