FROM node:12

RUN mkdir /public

COPY package.json /app/package.json

WORKDIR /app
RUN npm --loglevel warn install --production
COPY . /app

RUN npm --loglevel warn run postinstall --production
RUN chown -R nodejs:nodejs /public

USER 1000

CMD ["/app/run.sh"]

EXPOSE 8080
