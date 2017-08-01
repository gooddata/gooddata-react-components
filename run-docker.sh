#!/bin/bash -x
USERID=${HOST_USERID:=$(id -u ${USER})}
GROUPID=${HOST_GROUPID:=$(id -g ${USER})}

# USERID=0
# GROUPID=0

#EXTRA=$(pinata-ssh-mount)

NPM_AUTH_TOKEN=$(cat ~/.npmrc | cut -d "=" -f 2)
docker run --rm -e NPM_AUTH_TOKEN=$NPM_AUTH_TOKEN $EXTRA \
    -e USERID=$(id -u) -e GROUPID=$(getent group docker | cut -d: -f3) \
    -v /var/lib/jenkins-slave/.ssh/:/home/uiuser/.ssh/:ro \
    -v `pwd`:/code \
    -w /code \
    frontend-node-npm \
    ./docker/run.sh
