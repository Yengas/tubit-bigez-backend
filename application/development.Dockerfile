FROM mhart/alpine-node:6.9.5
LABEL maintainer "yigitcan@hotmail.com.tr"

# Install bash to Docker image.
RUN apk update && apk upgrade && \
    apk add --no-cache bash

# Add dumb-init for safely handling signals
ADD https://github.com/Yelp/dumb-init/releases/download/v1.1.1/dumb-init_1.1.1_amd64 /usr/local/bin/dumb-init
# Make dumb-init executable.
RUN chmod +x /usr/local/bin/dumb-init

# Creates a non-root-user.
RUN addgroup -S tubit && adduser -S -g tubit tubit
# Sets the HOME environment variable.
ENV HOME=/home/tubit

# Install global Dependencies
RUN npm install -g nodemon
RUN npm install -g forever

WORKDIR /application

# Add package.json to /application and install project dependencies.
ADD package.json .
RUN npm install

# Create a volume definition to indicate that we need a mount.
VOLUME /application/code

CMD dumb-init forever --spinSleepTime 10000 --minUptime 5000 -c "nodemon --exitcrash -L --watch /application/code" /application/code/bin/index.js
