FROM node:12.16
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
CMD [ "node", "src/server.js" ]
