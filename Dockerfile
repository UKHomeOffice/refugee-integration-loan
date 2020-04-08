FROM node:11

RUN mkdir /public

COPY package.json /app/package.json

WORKDIR /app
RUN npm --loglevel warn install --production
COPY . /app

RUN npm --loglevel warn run postinstall --production
RUN chown -R 1000:1000 /public

USER 1000

CMD ["/app/run.sh"]

EXPOSE 8080
