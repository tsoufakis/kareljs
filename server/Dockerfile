FROM node:12.16 as dev
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
ENTRYPOINT ["npm", "run"]
CMD ["start"]

FROM node:12.20-slim as prod
WORKDIR /app
COPY --from=dev /app .
ENTRYPOINT ["node", "src/server.js"]
