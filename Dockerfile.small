FROM node:12.14.1-alpine3.11 AS builder

RUN apk add make python g++
WORKDIR /usr/src/app

COPY Makefile ./package.json ./
RUN make install

COPY webpack.config.js .babelrc ./
COPY src src/
COPY public public/
COPY tests tests/
RUN make build

##

FROM node:12.14.1-alpine3.11
COPY --from=builder /usr/src/app /usr/src/app
WORKDIR /usr/src/app
CMD [ "node", "src/server.js" ]
