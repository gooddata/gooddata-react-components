#!/bin/bash -x
# USERID=${HOST_USERID:=$(id -u ${USER})}
# GROUPID=${HOST_GROUPID:=$(id -g ${USER})}

# USERID=0
# GROUPID=0

# EXTRA=$(pinata-ssh-mount)
#
# NPM_AUTH_TOKEN=$(cat ~/.npmrc | cut -d "=" -f 2)
# docker run --rm -u $USERID:$GROUPID -e NPM_AUTH_TOKEN=$NPM_AUTH_TOKEN $EXTRA \
#     -v `pwd`:/code \
#     -w /code \
#     -it frontend-node-npm \
#     ./docker/run.sh

SSH_KEY_NAME='pavel.langhammer-id_rsa'

NPM_AUTH_TOKEN=$(cat ~/.npmrc | cut -d "=" -f 2)

docker run --rm -e NPM_AUTH_TOKEN=$NPM_AUTH_TOKEN $EXTRA \
    -v `pwd`:/workspace \
    -w /workspace \
    -v $HOME/.ssh/$SSH_KEY_NAME:/root/.ssh/id_rsa:ro \
    frontend-node-npm \
    ./docker/run.sh
