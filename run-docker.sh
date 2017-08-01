#!/bin/bash -x
USERID=${HOST_USERID:=$(id -u ${USER})}
GROUPID=${HOST_GROUPID:=$(id -g ${USER})}

# USERID=0
# GROUPID=0

#EXTRA=$(pinata-ssh-mount)

NPM_AUTH_TOKEN=$(cat ~/.npmrc | cut -d "=" -f 2)
docker run --rm -u $USERID:$GROUPID -e NPM_AUTH_TOKEN=$NPM_AUTH_TOKEN $EXTRA \
    -v /var/lib/jenkins-slave/.ssh/:/var/lib/jenkins-slave/.ssh/:ro \
    -e /var/lib/jenkins-slave/ \
    -v `pwd`:/code \
    -w /code \
    frontend-node-npm \
    ./docker/run.sh
