FROM buildkite/puppeteer:8.0.0

RUN apt-get update && \
    # Setup nodejs group & nodejs user
    addgroup --system nodejs --gid 998 && \
    adduser --system nodejs --uid 999 --home /app/ && \
    chown -R 999:998 /app/

COPY package.json /app/package.json

WORKDIR /app

# uncomment the below for running with local changes to modules published via yalc
# COPY ./.yalc /app/.yalc

RUN npm --loglevel warn install --production  --no-optional

COPY . /app

# Give nodejs user permissions to public and app folders. Nodejs user is set to 999 and the group 998
RUN npm --loglevel warn run postinstall && \
    chown -R 999:998 public && \
    chown -R 999:998 pdf-form-submissions && \
    chown -R 999:998 /app/ && \
    # ensure user can exec the chrome binaries installed into the puppeteer directory
    chown -R 999:998 /app/node_modules/puppeteer

USER 999

CMD ["/app/run.sh"]

EXPOSE 8080
