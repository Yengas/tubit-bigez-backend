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

WORKDIR $HOME/ms

# Install dependencies.
ADD package.json .
# Install dev dependencies too since we will use this image for testing aswell.
RUN npm install

# Make everything in the home directory belong to tubit user.
RUN chown tubit:tubit -R $HOME/*

# Execute everything below this as the tubit user for security reasons.
USER tubit

# Add project code.
ADD ./bin ./bin
ADD ./src ./src
ADD ./test ./test

# Start with dumb-init for safely handling signals.
CMD ["dumb-init", "node", "bin/index.js"]
