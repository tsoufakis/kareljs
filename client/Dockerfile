FROM node:12.16 as builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:12.20-alpine3.10
WORKDIR /app
RUN npm install express
COPY --from=builder /app/prod-server.js .
COPY --from=builder  /app/public ./public
ENTRYPOINT ["node", "prod-server.js"]
