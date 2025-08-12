FROM quay.io/ukhomeofficedigital/hof-nodejs:20.19.0-alpine3.21@sha256:aad584fa26cb2838739527166c8965d95d0d2d9b88cfd5e3e2d3b8647ae03101

USER root

# Switch to UK Alpine mirrors, update package index and upgrade all installed packages
RUN echo "http://uk.alpinelinux.org/alpine/v3.21/main" > /etc/apk/repositories ; \
    echo "http://uk.alpinelinux.org/alpine/v3.21/community" >> /etc/apk/repositories ; \
    apk update && apk upgrade --no-cache

# Setup nodejs group & nodejs user
RUN addgroup --system nodejs --gid 998 && \
    adduser --system nodejs --uid 999 --home /app/ && \
    chown -R 999:998 /app/

USER 999

WORKDIR /app
