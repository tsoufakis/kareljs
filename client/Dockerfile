FROM node:12.16 as dev
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm test
ENTRYPOINT ["npm", "run"]
CMD ["start"]

FROM node:12.20-alpine3.10 as prod
WORKDIR /app
RUN npm install express
COPY --from=dev /app/prod-server.js .
COPY --from=dev  /app/public ./public
ENTRYPOINT ["node", "prod-server.js"]
CMD [""]
