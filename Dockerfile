FROM zenika/alpine-chrome:with-puppeteer@sha256:386def808d7db8af04bb6815f58647591d5a21d6a27d15613a0630e3d7661c7f

USER root
# Setup nodejs group & nodejs user
RUN addgroup --system nodejs --gid 998 && \
    adduser --system nodejs --uid 999 --home /app/ && \
    chown -R 999:998 /app/

WORKDIR /app

COPY . /app

# Give nodejs user permissions to public and app folders. Nodejs user is set to 999 and the group 998
RUN chown -R 999:998 public && \
    chown -R 999:998 pdf-form-submissions && \
    chown -R 999:998 /app/ && \
    # ensure user can exec the chrome binaries installed into the puppeteer directory
    chown -R 999:998 /app/node_modules/puppeteer

USER 999

RUN npm --loglevel warn install --production  --no-optional

HEALTHCHECK --interval=5m --timeout=3s \
 CMD curl --fail http://localhost:8080 || exit 1

CMD ["/app/run.sh"]

EXPOSE 8080
