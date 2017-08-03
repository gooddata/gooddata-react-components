#!/usr/bin/env bash

set -x
ls -la
pwd
#whoami
#id
echo $HOME
# mkdir -p /root/.ssh
# chmod 755 /root/.ssh
# ls -la /root/.ssh
# cp /workspace/.ssh/github_id-rsa /root/.ssh/
# chmod 600 /root/.ssh/github_id-rsa
ls -la $HOME


ls -la /root/.ssh
#cat /root/.ssh/$SSH_KEY_NAME
echo "//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" > $HOME/.npmrc
cat ~/.npmrc
echo 'Host github.com
    StrictHostKeyChecking no
' >> /root/.ssh/config
cat /root/.ssh/config
eval "$(ssh-agent)"
#ssh-agent
ssh-add /root/.ssh/$SSH_KEY_NAME

ssh-add -l

#ssh -v git@github.com

# yarn cache dir
# #echo "//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" >> /code/.npmrc \
yarn install --pure-lockfile
