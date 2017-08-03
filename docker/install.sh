#!/bin/bash

set -x

USERID=${USERID:-1000}
GROUPID=${GROUPID:-1000}
groupadd -fg "$GROUPID" uiuser
useradd -o uiuser -u "$USERID" -g "$GROUPID" -m
chown uiuser /home/uiuser
exec su-exec uiuser "$@"
