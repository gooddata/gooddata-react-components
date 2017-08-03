# Copyright © 2017, GoodData® Corporation. All rights reserved.

FROM docker-registry.na.intgdc.com/gdc_base_co7:latest

LABEL name="Docker Image for frontend testing and development on CentOS7" \
      maintainer="Rail <rail@gooddata.com>" \
      vendor="CentOS" \
      license="GPLv2"

# Node version
ENV NODE_VERSION 6.11.1

RUN yum clean all && \
     yum install -y gcc-c++

# Installing node.js & npm
RUN curl -sL https://rpm.nodesource.com/setup_6.x | /bin/bash -E -
RUN yum install -y nodejs-$NODE_VERSION

# Display node and npm versions
RUN node -v
RUN npm -v

# Installing yarn
RUN npm install -g -s --no-progress yarn
RUN yum install -y git
RUN yarn -v

#RUN mkdir -p /code
#WORKDIR /code
#COPY . /code
#COPY ./docker/install.sh /bin/install.sh
#ENV HOME /code
# https://github.com/ncopa/su-exec
COPY ./docker/su-exec.c /usr/src/su-exec.c
RUN  gcc /usr/src/su-exec.c -o /sbin/su-exec
#
COPY ./docker/install.sh /
#
ENTRYPOINT ["/install.sh"]
  # # Install packages via yarn
  # RUN ssh-agent /code/.ssh
  # RUN cd /code && \
  #   ls -la && \
  #   yarn install --pure-lockfile
