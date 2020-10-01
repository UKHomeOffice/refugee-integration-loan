FROM node:14

RUN apt-get update && \
    # See https://crbug.com/795759
    apt-get install -yq libgtk2.0-0 libgtk-3-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb libgbm-dev && \
    # Install latest chrome dev package, which installs the necessary libs to
    # make the bundled version of Chromium that Puppeteer installs work.
    apt-get install -y wget --no-install-recommends && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install libxss1 && \
    apt-get install -y google-chrome-unstable --no-install-recommends && \
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
