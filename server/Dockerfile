FROM node:14.15 as dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]

FROM node:14.15-slim as prod
WORKDIR /app
COPY --from=dev /app .
ENTRYPOINT ["node", "src/server.js"]
