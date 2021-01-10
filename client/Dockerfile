FROM node:14.15 as dev
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]

FROM dev as builder
RUN npm test
RUN npm run build

FROM node:14.15-alpine as prod
WORKDIR /app
RUN npm install express
COPY --from=builder /app/prod-server.js .
COPY --from=builder  /app/public ./public
ENTRYPOINT ["node", "prod-server.js"]
CMD [""]
