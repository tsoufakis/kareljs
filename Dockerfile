FROM node:12.16
WORKDIR /app

RUN mkdir server && mkdir client

WORKDIR /app/server
COPY server/package.json ./
RUN npm install

WORKDIR /app/client
COPY client/package.json ./
RUN npm install

WORKDIR /app
COPY . .

WORKDIR /app/client
RUN npx webpack-cli --entry ./src/index.js --output ./public/appbundle.js

WORKDIR /app
CMD [ "node", "server/src/server.js" ]
