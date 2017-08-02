#!/bin/bash -x
USERID=${HOST_USERID:=$(id -u ${USER})}
GROUPID=${HOST_GROUPID:=$(id -g ${USER})}

# USERID=0
# GROUPID=0

#EXTRA=$(pinata-ssh-mount)
# -v /var/lib/jenkins-slave/.ssh/:/home/uiuser/.ssh/:ro \
#NPM_AUTH_TOKEN=$(cat ~/.npmrc | cut -d "=" -f 2)
#-e USERID=$(id -u) -e GROUPID=$(getent group docker | cut -d: -f3) \
docker run --rm -u $USERID:$GROUPID -e NPM_AUTH_TOKEN=$NPM_AUTH_TOKEN $EXTRA \
    -v $(dirname $SSH_AUTH_SOCK):$(dirname $SSH_AUTH_SOCK) -e SSH_AUTH_SOCK=$SSH_AUTH_SOCK
    -v `pwd`:/code \
    -w /code \
    frontend-node-npm \
    ./docker/run.sh
