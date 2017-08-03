#!/bin/bash -x
# USERID=${HOST_USERID:=$(id -u ${USER})}
# GROUPID=${HOST_GROUPID:=$(id -g ${USER})}

# USERID=0
# GROUPID=0

#EXTRA=$(pinata-ssh-mount)
# -v /var/lib/jenkins-slave/.ssh/:/home/uiuser/.ssh/:ro \
#NPM_AUTH_TOKEN=$(cat ~/.npmrc | cut -d "=" -f 2)
#-e USERID=$(id -u) -e GROUPID=$(getent group docker | cut -d: -f3) \
SSH_KEY_NAME='github_id-rsa'

#NPM_AUTH_TOKEN=$(cat ~/.npmrc | cut -d "=" -f 2)

docker run --rm -e NPM_AUTH_TOKEN=$NPM_AUTH_TOKEN $EXTRA \
    -v `pwd`:/workspace \
    -w /workspace \
    -v $HOME/.ssh/$SSH_KEY_NAME:/tmp/.ssh/id_rsa:ro \
    frontend-node-npm \
    ./docker/run.sh
